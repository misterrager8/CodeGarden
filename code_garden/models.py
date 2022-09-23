import subprocess
from pathlib import Path


class Repository:
    def __init__(self, path):
        self.path = Path(path)

    def cmd(self, args: list):
        return subprocess.run(
            ["git"] + args, text=True, capture_output=True, cwd=self.path
        ).stdout

    @property
    def status(self):
        return self.cmd(["status"])

    def commit(self, msg: str):
        self.cmd(["add", "-A"])
        return self.cmd(["commit", "-m", msg])

    def log(self, limit: int):
        return self.cmd(["log", "--pretty=format:[%ar] %s", f"-{str(limit)}"])

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
