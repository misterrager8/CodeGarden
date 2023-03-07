import datetime
import json
import shutil
import subprocess

import markdown

from . import config


class Repository(object):
    def __init__(self, name: str):
        self.name = name

    @property
    def path(self):
        return config.HOME_DIR / self.name

    def run_command(self, cmd: list):
        return subprocess.run(cmd, cwd=self.path, text=True, capture_output=True).stdout

    @property
    def branches(self):
        return [
            Branch(self.name, i.strip())
            for i in self.run_command(["git", "branch"]).split("\n")
            if i.strip()
        ]

    @property
    def current_branch(self):
        for i in self.run_command(["git", "branch"]).split("\n"):
            if i.startswith("* "):
                return i.replace("* ", "")

    @property
    def log(self):
        _ = []
        for i in self.run_command(
            ["git", "log", "--oneline", "-5", "--pretty=format:%s\t%at\t%h"]
        ).split("\n"):
            if len(i.strip().split("\t")) == 2:
                _.append(
                    LogItem(
                        self.name,
                        "[No Commit Message]",
                        datetime.datetime.min,
                        i.strip().split("\t")[0],
                    )
                )
            else:
                _.append(
                    LogItem(
                        self.name,
                        i.strip().split("\t")[0],
                        datetime.datetime.fromtimestamp(int(i.split("\t")[1])),
                        i.strip().split("\t")[2],
                    )
                )

        return _

    @property
    def todos(self):
        return (
            [
                Todo(self.name, i.strip())
                for i in open(self.path / "todos.txt").readlines()
                if i.strip()
            ]
            if (self.path / "todos.txt").exists()
            else []
        )

    @property
    def diffs(self):
        return [
            DiffItem(self.name, (self.path / i.strip().split()[1]).name)
            for i in self.run_command(["git", "status", "--short"]).split("\n")
            if i.strip()
        ]

    @property
    def readme(self):
        raw = open(self.path / "README.md").read()
        return dict(txt=raw, md=markdown.markdown(raw))

    @property
    def ignored(self):
        return [
            IgnoreItem(self.name, i.strip())
            for i in open(self.path / ".gitignore").readlines()
            if i.strip()
        ]

    @classmethod
    def all(cls):
        return [
            Repository(i.name)
            for i in config.HOME_DIR.iterdir()
            if i.is_dir() and (i / ".git").exists()
        ]

    def init(self, brief_descrip: str):
        self.path.mkdir()
        open(self.path / "README.md", "w").write(
            f"# {self.name}\n---\n\n{brief_descrip}\n"
        )
        (self.path / "LICENSE.md").touch()
        open(self.path / ".gitignore", "w").write("todos.txt\n")
        (self.path / "todos.txt").touch()
        self.run_command(["git", "init"])
        self.commit("Initial commit", True)

    @classmethod
    def clone(cls, url: str):
        subprocess.run(["git", "clone", url], cwd=config.HOME_DIR)

    def delete(self):
        shutil.rmtree(self.path)

    def edit_readme(self, content: str):
        open((self.path / "README.md"), "w").write(content)

    def commit(self, msg: str, add_all: bool = False):
        self.run_command(["git", "add", "-A"])
        self.run_command(["git", "commit", "-am", msg])

    def reset_all(self):
        self.run_command(["git", "checkout", "."])
        self.run_command(["git", "clean", "-fd"])

    def to_dict(self):
        return dict(
            name=self.name,
            path=str(self.path),
            branches=[i.to_dict() for i in self.branches],
            current_branch=self.current_branch,
            log=[i.to_dict() for i in self.log],
            todos=[i.to_dict() for i in self.todos],
            diffs=[i.to_dict() for i in self.diffs],
            readme=self.readme,
            ignored=[i.to_dict() for i in self.ignored],
        )


class Branch(object):
    def __init__(self, repository, name):
        self.repository = repository
        self.name = name

    def create(self):
        Repository(self.repository).run_command(["git", "checkout", "-b", self.name])

    def delete(self):
        Repository(self.repository).run_command(["git", "branch", "-D", self.name])

    def checkout(self):
        Repository(self.repository).run_command(["git", "checkout", self.name])

    def merge(self, other_branch):
        Repository(self.repository).run_command(["git", "merge", other_branch])

    def compare(self, other="master"):
        return [
            LogItem(
                self.repository,
                i.strip().split("\t")[0],
                datetime.datetime.fromtimestamp(int(i.split("\t")[1])),
                i.strip().split("\t")[2],
            )
            for i in Repository(self.repository)
            .run_command(
                [
                    "git",
                    "log",
                    f"{other}..{self.name}",
                    "--oneline",
                    "--pretty=format:%s\t%at\t%h",
                ]
            )
            .split("\n")
            if i.strip()
        ]

    def to_dict(self):
        return dict(
            repository=self.repository,
            name=self.name,
            comparison=[i.to_dict() for i in self.compare()],
        )


class LogItem(object):
    def __init__(self, repository, name, timestamp, abbrev_hash):
        self.repository = repository
        self.name = name
        self.timestamp = timestamp
        self.abbrev_hash = abbrev_hash

    def to_dict(self):
        return dict(
            repository=self.repository,
            name=self.name,
            timestamp=self.timestamp.strftime("%B %-d, %Y @ %-I:%M %p"),
            abbrev_hash=self.abbrev_hash,
        )


class Todo(object):
    def __init__(self, repository, name):
        self.repository = repository
        self.name = name

    def create(self):
        todos_ = Repository(self.repository).todos
        todos_.append(self)

        with open((Repository(self.repository).path / "todos.txt"), "w") as f:
            for i in todos_:
                f.write(f"{i.name}\n")

    @classmethod
    def edit(cls, repository, id, new_name):
        todos_ = Repository(repository).todos
        todos_[id].name = new_name

        with open((Repository(repository).path / "todos.txt"), "w") as f:
            for i in todos_:
                f.write(f"{i.name}\n")

    @classmethod
    def delete(cls, repository, id):
        todos_ = Repository(repository).todos
        del todos_[id]

        with open((Repository(repository).path / "todos.txt"), "w") as f:
            for i in todos_:
                f.write(f"{i.name}\n")

    def to_dict(self):
        return dict(repository=self.repository, name=self.name)


class DiffItem(object):
    def __init__(self, repository, name):
        self.repository = repository
        self.name = name

    def to_dict(self):
        return dict(repository=self.repository, name=self.name)


class IgnoreItem(object):
    def __init__(self, repository, name):
        self.repository = repository
        self.name = name

    def create(self):
        ignores_ = Repository(self.repository).ignored
        ignores_.append(self)

        with open((Repository(self.repository).path / ".gitignore"), "w") as f:
            for i in ignores_:
                f.write(f"{i.name}\n")

    @classmethod
    def delete(cls, repository, id):
        ignores_ = Repository(repository).ignored
        del ignores_[id]

        with open((Repository(repository).path / ".gitignore"), "w") as f:
            for i in ignores_:
                f.write(f"{i.name}\n")

    def to_dict(self):
        return dict(repository=self.repository, name=self.name)
