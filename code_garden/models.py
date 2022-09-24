import subprocess
from pathlib import Path

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

    @classmethod
    def all(cls):
        return [
            Repository(i)
            for i in HOME_DIR.iterdir()
            if i.is_dir() and (i / ".git").exists()
        ]

    @property
    def status(self):
        return self.cmd(["status"])

    def commit(self, msg: str):
        self.cmd(["add", "-A"])
        return self.cmd(["commit", "-m", msg])

    def log(self, limit: int = 5):
        return self.cmd(["log", "--pretty=format:[%ar] %s", f"-{str(limit)}"]).split(
            "\n"
        )

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

    @property
    def todos(self):
        path = self.path / "todo.txt"
        return [i.strip() for i in open(path).readlines()] if path.exists() else []

    def save_todos(self, todos_: list):
        path = self.path / "todo.txt"
        with open(path, "w") as f:
            for i in todos_:
                f.write(f"{i}\n")
