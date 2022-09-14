import shutil
import subprocess
from pathlib import Path

from code_garden import config

HOME_DIR = Path(config.HOME_DIR)


class Repo:
    def __init__(self, path: Path):
        self.path = path
        self.name = self.path.name

    def get_todos(self):
        x = (
            [
                Todo(
                    i.strip().replace("x ", ""),
                    True if i.strip().startswith("x ") else False,
                )
                for i in open(self.path / "todo.txt").readlines()
            ]
            if (self.path / "todo.txt").exists()
            else []
        )
        return x

    def set_todos(self, todos: list):
        with open(self.path / "todo.txt", "w") as f:
            for i in todos:
                y = f"x {i.description}\n" if i.done else f"{i.description}\n"
                f.write(y)

    def clear_todos(self):
        todos_ = [i for i in self.get_todos() if not i.done]
        self.set_todos(todos_)

    def create(self, description):
        self.path.mkdir()
        self.git(["git", "init"])
        # subprocess.run("git init".split(), cwd=self.path)

        open(self.path / "README.md", "w").write(f"# {self.name}\n\n{description}\n")
        open(self.path / ".gitignore", "w").write("todo.txt\n")
        (self.path / "LICENSE.md").touch()
        (self.path / "todo.txt").touch()

        self.git(["git", "add", "-A"])
        self.git(["git", "commit", "-am", "Initial commit"])

    def delete(self):
        shutil.rmtree(self.path)

    @classmethod
    def all(cls):
        return [
            Repo(i) for i in HOME_DIR.iterdir() if i.is_dir() and (i / ".git").exists()
        ]

    # Git Functions
    def git(self, cmd: list):
        return subprocess.run(cmd, cwd=self.path, text=True, capture_output=True).stdout

    def get_branches(self):
        return [i.strip() for i in self.git(["git", "branch"]).split("\n") if i]

    def get_branch(self):
        return [i for i in self.get_branches() if "* " in i][0].strip("* ")


class Todo:
    def __init__(self, description: str, done: bool):
        self.description = description
        self.done = done
