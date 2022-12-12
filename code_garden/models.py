import datetime
import json
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
        with open(self.path / "todos.json") as f:
            data = json.load(f)
        return [Todo(i) for i in data["todos"]]

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

    @property
    def ignored(self) -> list:
        return [
            i.strip() for i in open(self.path / ".gitignore").readlines() if i.strip()
        ]

    def create_branch(self, name: str) -> str:
        return self.run_cmd(["git", "checkout", "-b", name])

    def set_todos(self, todos: list):
        with open((self.path / "todos.json"), "w") as f:
            json.dump(dict(todos=[i.data for i in todos]), f, indent=4)

    def init(self, brief_descrip: str):
        self.path.mkdir()
        open(self.path / "README.md", "w").write(
            f"# {self.name}\n---\n\n{brief_descrip}\n"
        )
        (self.path / "LICENSE.md").touch()
        open(self.path / ".gitignore", "w").write("todos.json\n")
        open(self.path / "todos.json", "w").write('{"todos":[]}')
        self.run_cmd(["git", "init"])
        self.commit("Initial commit")

    def push(self) -> str:
        return self.run_cmd(["git", "push", "origin"])

    def commit(self, msg: str) -> str:
        self.run_cmd(["git", "add", "-A"])
        return self.run_cmd(["git", "commit", "-am", msg])

    def reset(self) -> str:
        return ""

    def checkout(self, branch: str, new_branch: bool = False) -> str:
        return self.run_cmd(["git", "checkout", branch])

    def merge(self, branch: str) -> str:
        return ""

    def ignore(self, file: str):
        open(self.path / ".gitignore", "a").write("\n" + Path(file).name + "\n")

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
        return dict(
            name=self.name, current_branch=self.current_branch, path=str(self.path)
        )


class Todo(object):
    def __init__(self, data: dict):
        self.data = data

    def to_string(self) -> str:
        return f"{self.data['category']}: {self.data['description']}"

    def toggle(self):
        self.data["done"] = not self.data["done"]


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
