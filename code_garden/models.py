import subprocess
from pathlib import Path

import click
import markdown

from code_garden import config

HOME_DIR = Path(config.HOME_DIR)


class Repository:
    def __init__(self, path):
        self.path = Path(path)

    def cmd(self, args: list):
        return subprocess.run(
            ["git"] + args, text=True, capture_output=True, cwd=self.path
        ).stdout

    @property
    def name(self):
        return self.path.name

    @property
    def readme(self):
        return markdown.markdown(open(self.path / "README.md").read())

    @classmethod
    def init(cls, name: str, description: str = ""):
        repo_ = Repository(HOME_DIR / name)
        repo_.path.mkdir()
        open(repo_.path / "README.md", "w").write(f"# {name}\n---\n\n{description}\n")
        (repo_.path / "LICENSE.md").touch()
        (repo_.path / ".gitignore").touch()

        repo_.cmd(["init"])
        return repo_.commit("Initial commit")

    @classmethod
    def all(cls):
        return [
            Repository(i)
            for i in HOME_DIR.iterdir()
            if i.is_dir() and (i / ".git").exists()
        ]

    @property
    def status(self):
        return [
            ChangeItem(i[2:].strip(), i.strip()[0])
            for i in self.cmd(["status", "-s"]).split("\n")
            if i
        ]

    @property
    def last_updated(self):
        return self.log()[0].time

    def commit(self, msg: str):
        self.cmd(["add", "-A"])
        return self.cmd(["commit", "-m", msg])

    @property
    def ignored(self):
        return [i.strip() for i in open(self.path / ".gitignore").readlines()]

    def set_ignored(self, ignores: list):
        with open(self.path / ".gitignore", "w") as f:
            for i in ignores:
                f.write(f"{i}\n")

    def log(self, limit: int = 5):
        return [
            LogItem(i.split("\t")[0], i.split("\t")[1])
            for i in self.cmd(
                ["log", "--pretty=format:%s\t%ar", f"-{str(limit)}"]
            ).split("\n")
        ]

    @property
    def branches(self):
        return [
            i.strip().replace("* ", "") for i in self.cmd(["branch"]).split("\n") if i
        ]

    @property
    def branch(self):
        for i in self.cmd(["branch"]).split("\n"):
            if i.startswith("* "):
                return i.strip().replace("* ", "")

    def create_branch(self, name: str):
        return self.cmd(["checkout", "-b", name])

    def checkout(self, branch: str):
        return self.cmd(["checkout", branch])

    def merge(self, current_branch: str, other_branch: str):
        click.secho(self.checkout(current_branch), fg=config.CLI_COLOR)
        click.secho(self.cmd(["merge", other_branch]), fg=config.CLI_COLOR)
        click.secho(self.checkout(other_branch), fg=config.CLI_COLOR)

    @property
    def todos(self):
        path = self.path / "todo.txt"
        return (
            [Todo.from_text(i.strip()) for i in open(path).readlines()]
            if path.exists()
            else []
        )

    @property
    def undone_count(self):
        return len([i for i in self.todos if not i.done])

    @property
    def any_done(self):
        return any(i.done for i in self.todos)

    def clear_completed(self):
        self.save_todos([i for i in self.todos if not i.done])

    def save_todos(self, todos_: list):
        path = self.path / "todo.txt"
        with open(path, "w") as f:
            for i in todos_:
                f.write(f"{i.plaintext}\n")


class Todo:
    def __init__(self, name: str, done: bool = False):
        self.name = name
        self.done = done

    @classmethod
    def from_text(cls, plaintext):
        return Todo(plaintext[4:], plaintext.startswith("[x] "))

    @property
    def plaintext(self):
        return f"[{'x' if self.done else ' '}] {self.name}"

    def mark(self):
        self.done = not self.done


class LogItem:
    def __init__(self, subject: str, time: str):
        self.subject = subject
        self.time = time


class ChangeItem:
    def __init__(self, filepath: str, type: str):
        self.filepath = filepath
        self.type = type

    def ignore(self, repo_: Repository):
        open((repo_.path / ".gitignore"), "a").write(f"{self.filepath}\n")

    def reset(self, repo_: Repository):
        return repo_.cmd(["checkout", "--", self.filepath])

    @property
    def filename(self):
        return self.filepath.split("/")[-1]

    @property
    def color(self):
        choices = {"M": "orange", "A": "green", "D": "red", "R": "yellow", "?": "green"}
        return choices[self.type]
