import datetime
import json
import shutil
import subprocess

import markdown

from . import config


class Repository(object):
    """A Git repository object.

    All Repositories should have (1) a README.md file, and (2) a .git folder.

    Attributes:
        path: Full path of the Repository.
        branches: All local branches of the Repository.
        current_branch: The currently checked-out branch.
        log: List of (5 default) commits, sorted by most recent.
        todos: List of tasks found in the todos.txt file.
        diffs: List of all changed file in the current Repository.
        readme: Dict object of text in the README.md file 'txt' is the plaintext content, 'md' is the Markdown-formatted text.
        ignored: List of items in the .gitignore file.

    """

    def __init__(self, name: str):
        self.name = name

    @property
    def path(self):
        return config.HOME_DIR / self.name

    def run_command(self, cmd: list):
        """Run command in the Repository's directory.

        Args:
            cmd (list): List of arguments in the command. (splitting whitespace on text is recommended)
        """
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
        """Get all Repositories in the home directory."""
        return [
            Repository(i.name)
            for i in config.HOME_DIR.iterdir()
            if i.is_dir() and (i / ".git").exists()
        ]

    def init(self, brief_descrip: str):
        """Create a new Repository.

        Args:
            brief_descrip (str): Short description of what the Repository contains.
        """
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
        """Clone a Repository.

        Args:
            url (str): URL of the Git Repository.
        """
        subprocess.run(["git", "clone", url], cwd=config.HOME_DIR)

    def delete(self):
        """Delete this Repository."""
        shutil.rmtree(self.path)

    def edit_readme(self, content: str):
        """Edit this Repository's README file.

        Args:
            content (str): New plaintext content of the README.
        """
        open((self.path / "README.md"), "w").write(content)

    def commit(self, msg: str):
        """Commit all local changes to git.

        Args:
            msg (str): Commit message.
        """
        self.run_command(["git", "add", "-A"])
        self.run_command(["git", "commit", "-am", msg])

    def reset_all(self):
        """Discard all local changes, reset Repository to most recent commit."""
        self.run_command(["git", "checkout", "."])
        self.run_command(["git", "clean", "-fd"])

    def to_dict(self):
        """Get a dict representation of the Repository object (for API usage)."""
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
    """Branch object.

    Attributes:
        repository (str): name of the containing Repository
        name (str): name of this branch.
    """

    def __init__(self, repository, name):
        self.repository = repository
        self.name = name

    def create(self):
        """Create a new branch."""
        Repository(self.repository).run_command(["git", "checkout", "-b", self.name])

    def delete(self):
        """Delete this branch."""
        Repository(self.repository).run_command(["git", "branch", "-D", self.name])

    def checkout(self):
        """Checkout this branch."""
        Repository(self.repository).run_command(["git", "checkout", self.name])

    def merge(self, other_branch):
        """Merge this branch with another.

        Args:
            other_branch (str): Other branch to merge with.
        """
        Repository(self.repository).run_command(["git", "merge", other_branch])

    def to_dict(self):
        """Get a dict representation of this object (for API use)."""
        return dict(
            repository=self.repository,
            name=self.name,
            comparison=[i.to_dict() for i in self.compare()],
        )


class LogItem(object):
    """Commit item from log.

    Attributes:
        repository (str): name of the containing Repository
        name (str): subject line of this commit.
    """

    def __init__(self, repository, name, timestamp, abbrev_hash):
        self.repository = repository
        self.name = name
        self.timestamp = timestamp
        self.abbrev_hash = abbrev_hash

    def to_dict(self):
        """Get a dict representation of this object (for API use)."""
        return dict(
            repository=self.repository,
            name=self.name,
            timestamp=self.timestamp.strftime("%B %-d, %Y @ %-I:%M %p"),
            abbrev_hash=self.abbrev_hash,
        )


class Todo(object):
    """Todo item found in todos.txt.

    Attributes:
        repository (str): name of the containing Repository
        name (str): description of this Todo item.
    """

    def __init__(self, repository, name):
        self.repository = repository
        self.name = name

    def create(self):
        """Create a new Todo."""
        todos_ = Repository(self.repository).todos
        todos_.append(self)

        with open((Repository(self.repository).path / "todos.txt"), "w") as f:
            for i in todos_:
                f.write(f"{i.name}\n")

    @classmethod
    def edit(cls, repository, id, new_name):
        """Edit a Todo item.

        Args:
            repository (str): name of the Repository that contains this Todo.
            id (int): index, or location, of the Todo in the list.
            new_name (str): new description of the Todo item.
        """
        todos_ = Repository(repository).todos
        todos_[id].name = new_name

        with open((Repository(repository).path / "todos.txt"), "w") as f:
            for i in todos_:
                f.write(f"{i.name}\n")

    @classmethod
    def delete(cls, repository, id):
        """Delete a Todo item.

        Args:
            repository (str): name of the Repository that contains this Todo.
            id (int): index, or location, of the Todo in the list.
        """
        todos_ = Repository(repository).todos
        del todos_[id]

        with open((Repository(repository).path / "todos.txt"), "w") as f:
            for i in todos_:
                f.write(f"{i.name}\n")

    def to_dict(self):
        """Get a dict representation of this object (for API use)."""
        return dict(repository=self.repository, name=self.name)


class DiffItem(object):
    """Changed item in the Repository.

    Attributes:
        repository (str): name of the containing Repository
        name (str): name of this file.
    """

    def __init__(self, repository, name):
        self.repository = repository
        self.name = name

    @property
    def path(self):
        return Repository(self.repository).path / self.name

    def reset(self):
        """Reset this file to its original state in the most recent commit."""
        Repository(self.repository).run_command(
            ["git", "checkout", "HEAD", "--", str(self.path)]
        )

    def to_dict(self):
        """Get a dict representation of this object (for API use)."""
        return dict(repository=self.repository, name=self.name, path=str(self.path))


class IgnoreItem(object):
    """Ignored items found in the .gitignore file.

    Attributes:
        repository (str): name of the containing Repository
        name (str): name of this file.
    """

    def __init__(self, repository, name):
        self.repository = repository
        self.name = name

    def create(self):
        """Add this item to the .gitignore."""
        ignores_ = Repository(self.repository).ignored
        ignores_.append(self)

        with open((Repository(self.repository).path / ".gitignore"), "w") as f:
            for i in ignores_:
                f.write(f"{i.name}\n")

    @classmethod
    def delete(cls, repository, id):
        """Delete an Ignore item.

        Args:
            repository (str): name of the Repository that contains this Ignore item.
            id (int): index, or location, of the Ignore item in the list.
        """
        ignores_ = Repository(repository).ignored
        del ignores_[id]

        with open((Repository(repository).path / ".gitignore"), "w") as f:
            for i in ignores_:
                f.write(f"{i.name}\n")

    def to_dict(self):
        """Get a dict representation of this object (for API use)."""
        return dict(repository=self.repository, name=self.name)
