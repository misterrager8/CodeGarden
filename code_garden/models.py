import datetime
import subprocess
from pathlib import Path

import markdown

from code_garden import config


class Repository(object):
    def __init__(self, path: Path):
        self.path = path

    @property
    def name(self) -> str:
        return self.path.name

    @property
    def readme(self) -> str:
        return markdown.markdown(open(self.path / "README.md").read())

    @property
    def todos(self) -> list:
        return (
            [
                Todo.from_text(i.strip())
                for i in open(self.path / "todos.txt").readlines()
                if i.strip()
            ]
            if (self.path / "todos.txt").exists()
            else []
        )

    @property
    def log(self, limit: int = 5) -> list:
        return [
            LogItem(
                i.split("\t")[0], datetime.datetime.fromtimestamp(int(i.split("\t")[1]))
            )
            for i in self.run_cmd(
                ["git", "log", "--pretty=format:%s\t%at", f"-{str(limit)}"]
            ).split("\n")
        ]

    @property
    def diffs(self) -> list:
        return [
            File(str(self.path / i[2:].strip()), i.strip().split()[0])
            for i in self.run_cmd(["git", "status", "--short"]).split("\n")
            if i.split()
            and (i.strip().split()[0] == "D" or (self.path / i[2:].strip()).is_file())
        ]

    @property
    def branches(self) -> list:
        return [
            i.strip() for i in self.run_cmd(["git", "branch"]).split("\n") if i.strip()
        ]

    @property
    def current_branch(self) -> str:
        for i in self.branches:
            if i.startswith("* "):
                return i.replace("* ", "")

    def set_todos(self, todos: list):
        with open((self.path / "todos.txt"), "w") as f:
            for i in todos:
                f.write(i.to_text() + "\n")

    def init(self) -> str:
        return ""

    def push(self) -> str:
        return ""

    def commit(self, msg: str) -> str:
        self.run_cmd(["git", "add", "-A"])
        return self.run_cmd(["git", "commit", "-am", msg])

    def reset(self) -> str:
        return ""

    def checkout(self, branch: str, new_branch: bool = False) -> str:
        return self.run_cmd(["git", "checkout", branch])

    def merge(self, branch: str) -> str:
        return ""

    @classmethod
    def all(cls) -> list:
        return [
            Repository(i)
            for i in config.HOME_DIR.iterdir()
            if i.is_dir() and (i / ".git").exists()
        ]

    def run_cmd(self, args_: list) -> str:
        return subprocess.run(
            args_, cwd=self.path, capture_output=True, text=True
        ).stdout

    def to_dict(self) -> dict:
        return dict(name=self.name, current_branch=self.current_branch)


class Todo(object):
    def __init__(self, description: str, done: bool):
        self.description = description
        self.done = done

    def toggle(self):
        self.done = not self.done

    @classmethod
    def from_text(cls, txt: str):
        return Todo(txt[4:], txt.startswith("[x] "))

    def to_text(self) -> str:
        return f"[{'x' if self.done else ' '}] {self.description}"

    def to_dict(self) -> dict:
        return dict(description=self.description, done=self.done)


class File(object):
    def __init__(self, path: str, status: str = None):
        self.path = path
        self.status = status

    @property
    def name(self) -> str:
        return self.path.split("/")[-1] or self.path.split("/")[-2]

    @property
    def content(self) -> str:
        return open(self.path).read() if Path(self.path).exists() else "File deleted."

    @property
    def color(self):
        choices = {
            "M": "orange",
            "A": "green",
            "D": "red",
            "R": "yellow",
            "??": "green",
        }
        return choices[self.status]

    def to_dict(self) -> dict:
        return dict(
            path=self.path,
            status=self.status,
            color=self.color,
            name=self.name,
        )


class LogItem(object):
    def __init__(self, msg: str, timestamp: datetime.datetime):
        self.msg = msg
        self.timestamp = timestamp

    def to_dict(self) -> dict:
        return dict(
            msg=self.msg, timestamp=self.timestamp.strftime("%B %-d, %Y @ %-I:%M %p")
        )
