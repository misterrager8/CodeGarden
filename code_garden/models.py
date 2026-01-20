import datetime
import json
from pathlib import Path
import re
import shutil
import subprocess

import click
import requests

from code_garden.readme import Readme
from code_garden.todos import Todo

from . import config


class Repository(object):
    """A Git repository object.

    All Repositories should have (1) a README.md file, and (2) a .git folder.

    Attributes:
        path: Full path of the Repository.
        branches: All local branches of the Repository.
        current_branch: The currently checked-out branch.
        log: List of (5 default) commits, sorted by most recent.
        todos: List of tasks found in the database file.
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
    def stashes(self):
        return [
            i.strip().split(":")[2]
            for i in self.run_command(["git", "stash", "list"]).split("\n")
            if i.strip()
        ]

    @property
    def current_branch(self):
        for i in self.run_command(["git", "branch"]).split("\n"):
            if i.startswith("* "):
                return Branch(self.name, i.replace("* ", ""))

    def compare_branches(self, base_branch, child_branch):
        return self.run_command(
            ["git", "rev-list", "--count", f"{base_branch}..{child_branch}"]
        )

    @property
    def log(self):
        _ = []
        try:
            for i in self.run_command(
                ["git", "log", "--oneline", "-1000", "--pretty=format:%s\t%at\t%h\t%an"]
            ).split("\n"):
                if len(i.strip().split("\t")) == 2:
                    _.append(
                        LogItem(
                            self.name,
                            "[No Commit Message]",
                            datetime.datetime.min,
                            i.strip().split("\t")[0],
                            i.strip().split("\t")[1],
                        )
                    )
                else:
                    _.append(
                        LogItem(
                            self.name,
                            i.strip().split("\t")[0],
                            datetime.datetime.fromtimestamp(int(i.split("\t")[1])),
                            i.strip().split("\t")[2],
                            i.strip().split("\t")[3],
                        )
                    )

            return _
        except:
            return []

    @property
    def todos(self):
        return Todo.see_list(self.name)

    @property
    def diffs(self):
        diffs = []
        for i in self.run_command(["git", "status", "-su"]).split("\n"):
            if i.strip():
                path_ = self.path / i[3:].replace('"', "")
                prefix = i[:2]
                type_ = ""
                staged = False

                staged = prefix[0] != " " or prefix[0] != "?"
                if prefix[0] == " " or prefix[0] == "?":
                    staged = False
                else:
                    staged = True

                if prefix[1] == "M" or prefix[0] == "M":
                    type_ = "modified"
                elif prefix[1] == "D" or prefix[0] == "D":
                    type_ = "deleted"
                elif prefix[1] == "?" or prefix[1] == "A" or prefix[0] == "A":
                    type_ = "added"

                diffs.append(DiffItem(self.name, path_, type_, staged))

        return diffs

    @property
    def readme(self):
        try:
            return open(self.path / "README.md").read()
        except:
            return ""

    @property
    def ignored(self):
        try:
            return [
                IgnoreItem(self.name, i.strip())
                for i in open(self.path / ".gitignore").readlines()
                if i.strip()
            ]
        except:
            return []

    @property
    def remote_url(self):
        return (
            self.run_command(["git", "remote", "-v"]).split("\n")[0].split()[1]
            if self.run_command(["git", "remote", "-v"])
            else None
        )

    # git rev-list --count PARENT..CHILD

    @classmethod
    def all(cls):
        """Get all Repositories in the home directory."""
        return sorted(
            [
                Repository(i.name)
                for i in config.HOME_DIR.iterdir()
                if i.is_dir() and (i / ".git").exists()
            ],
            key=lambda x: x.log[0].timestamp,
            reverse=True,
        )

    @classmethod
    def generate_name(cls):
        adj = requests.get("https://random-word-api.herokuapp.com/word").json()[0]
        noun = requests.get("https://random-word-api.herokuapp.com/word").json()[0]
        return f"{adj}-{noun}"

    def init(self, brief_descrip: str):
        """Create a new Repository.

        Args:
            brief_descrip (str): Short description of what the Repository contains.
        """
        files = ["LICENSE.md", ".gitignore"]
        self.path.mkdir()
        Readme(self.name, brief_descrip).write(self.path)
        for i in files:
            (self.path / i).touch()

        self.run_command(["git", "init"])
        self.commit("Initial commit", add_all=True)

    @classmethod
    def clone(cls, url: str):
        """Clone a Repository.

        Args:
            url (str): URL of the Git Repository.
        """
        subprocess.run(["git", "clone", url], cwd=config.HOME_DIR)

    def config(self):
        return [
            i
            for i in self.run_command(
                ["git", "config", "--local", "--list"]
            ).splitlines()
        ]

    def delete(self):
        """Delete this Repository."""
        shutil.rmtree(self.path)

    def edit_readme(self, content: str):
        """Edit this Repository's README file.

        Args:
            content (str): New plaintext content of the README.
        """
        open((self.path / "README.md"), "w").write(content)

    def commit(self, msg: str, add_all=False):
        """Commit all staged changes to git.

        Args:
            msg (str): Commit message.
        """
        if add_all:
            self.stage_all()
        self.run_command(["git", "commit", "-m", msg])

    def stage_all(self):
        """Stage all files in the working directory."""
        self.run_command(["git", "add", "-A"])

    def unstage_all(self):
        """Unstage all files in the working directory."""
        self.run_command(["git", "reset"])

    def reset_all(self):
        """Discard all local changes, reset Repository to most recent commit."""
        self.run_command(["git", "checkout", "."])
        self.run_command(["git", "clean", "-fd"])

    def push(self):
        """Push to remote branch."""
        return self.run_command(["git", "push", "origin"])

    def stash(self, name):
        """Stash changes."""
        self.run_command(
            [
                "git",
                "stash",
                "push",
                "-um",
                name or datetime.datetime.now().strftime("%B %-d, %Y"),
            ]
        ),

    def unstash(self, id_):
        """Unstash changes."""
        self.run_command(["git", "stash", "pop", str(id_)])

    def drop_stash(self, id_):
        """Delete stash."""
        self.run_command(["git", "stash", "drop", str(id_)])

    def pull(self):
        """Pull from remote."""
        return self.run_command(["git", "pull", "--all"])

    def export(self):
        """Export all Repository info, such as todos, to single JSON file."""
        with open(config.HOME_DIR / f"{self.name}.json", "w") as f:
            json.dump(self.to_dict(), f, indent=4)

    def export_todos(self):
        """Export all todos to single JSON file."""
        results = {"todos": [i.to_dict() for i in self.todos]}
        json.dump(results, open(self.path / "todos.json", "w"), indent=4)

    def import_todos(self):
        """Import todos from a JSON file."""
        results = json.load(open(self.path / "todos.json")).get("todos")
        for i in results:
            todo_ = Todo(
                i.get("name"),
                i.get("description"),
                i.get("tag"),
                datetime.datetime.now(),
                i.get("status"),
                self.name,
            )
            todo_.add()

    def merge(self, parent_branch, child_branch, merge_msg, delete_head=False):
        """Merge two branches.

        Args:
            parent_branch (str): Branch receiving the merge.
            child_branch (str): Branch merging into parent.
            merge_msg (str): Commit message.
            delete_head (bool): Delete child branch after merge
        """
        self.run_command(["git", "checkout", parent_branch])
        self.run_command(["git", "merge", "--squash", child_branch])
        self.run_command(["git", "commit", "-m", merge_msg])
        if delete_head:
            self.run_command(["git", "branch", "-D", child_branch])

    # def get_file_history(self, path):
    #     _ = []
    #     try:
    #         for i in self.run_command(
    #             [
    #                 "git",
    #                 "log",
    #                 "--oneline",
    #                 "-1000",
    #                 "--pretty=format:%s\t%at\t%h\t%an",
    #                 path,
    #             ]
    #         ).split("\n"):
    #             if len(i.strip().split("\t")) == 2:
    #                 _.append(
    #                     LogItem(
    #                         self.name,
    #                         "[No Commit Message]",
    #                         datetime.datetime.min,
    #                         i.strip().split("\t")[0],
    #                         i.strip().split("\t")[1],
    #                     )
    #                 )
    #             else:
    #                 _.append(
    #                     LogItem(
    #                         self.name,
    #                         i.strip().split("\t")[0],
    #                         datetime.datetime.fromtimestamp(int(i.split("\t")[1])),
    #                         i.strip().split("\t")[2],
    #                         i.strip().split("\t")[3],
    #                     )
    #                 )

    #         return _
    #     except:
    #         return []

    def get_file_at_commit(self, path, hash):
        before = self.run_command(
            [
                "git",
                "show",
                f"{hash}^:{path}",
            ]
        )
        after = self.run_command(["git", "show", f"{hash}:{path}"])

        return {
            "before": before,
            "after": after,
        }

    def get_files_at_commit(self, hash):
        files_ = []
        summary = self.run_command(["git", "log", "-1", "--format=%B", hash])
        changed = [
            str(self.path / i)
            for i in self.run_command(
                ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", hash]
            ).splitlines()
        ]
        for i in self.run_command(["git", "ls-tree", "-r", hash, "--name-only"]).split(
            "\n"
        ):
            path_ = self.path / i
            if not path_.is_dir():
                files_.append(
                    {
                        "path": str(path_),
                        "name": path_.name,
                        "relativePath": i,
                        "changed": str(path_) in changed,
                    }
                )
        return {
            "summary": summary,
            "files": sorted(
                files_, key=lambda x: (-x.get("changed"), x.get("name").casefold())
            ),
        }

    def blame(self, hash, line_number, path):
        "git blame 8c150e8 -L 1,1 -- README.md"
        return self.run_command(
            ["git", "blame", hash, "-L", f"{line_number},{line_number}", "--", path]
        )

    def to_dict(self):
        """Get a dict representation of the Repository object (for API usage)."""
        return dict(
            name=self.name,
            path=str(self.path),
            branches=[i.to_dict() for i in self.branches],
            current_branch=self.current_branch.to_dict() if self.current_branch else {},
            remote_url=self.remote_url,
            log=[i.to_dict() for i in self.log],
            todos=[i.to_dict() for i in self.todos],
            diffs=[i.to_dict() for i in self.diffs],
            readme=self.readme,
            ignored=[i.to_dict() for i in self.ignored],
            stashes=self.stashes,
        )

    def __str__(self):
        return f"{self.name.ljust(20)} (current branch: {self.current_branch.name}, last updated: {self.log[0].timestamp.strftime('%B %-d, %Y @ %-I:%M %p')})"


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
        )


class LogItem(object):
    """Commit item from log.

    Attributes:
        repository (str): name of the containing Repository
        name (str): subject line of this commit.
    """

    def __init__(self, repository, name, timestamp, abbrev_hash, author):
        self.repository = repository
        self.name = name
        self.timestamp = timestamp
        self.abbrev_hash = abbrev_hash
        self.author = author

    @classmethod
    def get(cls, repository, abbrev_hash):
        """Get more details about a specified commit."""
        repo_ = Repository(repository)
        commit_info = repo_.run_command(
            ["git", "log", "-1", "--format=%B", abbrev_hash]
        )

        files_ = [
            {
                "path": i,
                "name": (repo_.path / i).name,
            }
            for i in repo_.run_command(
                ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", abbrev_hash]
            ).splitlines()
        ]

        return {
            "commitInfo": commit_info,
            "files": files_,
        }

    def to_dict(self):
        """Get a dict representation of this object (for API use)."""
        return dict(
            repository=self.repository,
            name=self.name,
            timestamp=self.timestamp.strftime("%B %-d, %Y @ %-I:%M %p"),
            iso_timestamp=self.timestamp.strftime("%Y-%m-%dT%H:%M:00Z"),
            abbrev_hash=self.abbrev_hash,
            author=self.author,
        )


class DiffItem(object):
    """Changed item in the Repository.

    Attributes:
        repository (str): name of the containing Repository
        name (str): name of this file.
    """

    def __init__(self, repository, path, type_, staged=False):
        self.repository = repository
        self.path = path
        self.type_ = type_
        self.staged = staged

    @property
    def color(self):
        """Color representation of diff's current status"""
        choices = {
            "modified": "#bf5408",
            "added": "green",
            "deleted": "red",
        }
        return choices.get(self.type_) or "green"

    def reset(self):
        """Reset this file to its original state in the most recent commit."""
        Repository(self.repository).run_command(
            ["git", "checkout", "HEAD", "--", str(self.path)]
        )

    def toggle_stage(self):
        """If file is staged, unstage it, vice versa."""
        stage = ["git", "add", str(self.path)]
        unstage = ["git", "reset", str(self.path)]
        Repository(self.repository).run_command(unstage if self.staged else stage)

    def get_diff(self):
        """See specific changes in a file."""
        diff_ = (
            Repository(self.repository)
            .run_command(["git", "diff", "--unified=0", "--no-prefix", self.path])
            .splitlines()
        )
        hunks = []
        current_hunk = None

        for line in diff_:
            if line.startswith("@@"):
                if current_hunk:
                    hunks.append(current_hunk)
                current_hunk = {
                    "id": line,
                    "lines": [],
                }
            elif re.match(r"^\+[^+]", line):
                current_hunk["lines"].append({"added": True, "content": line[1:]})
            elif re.match(r"^-[^-]", line):
                current_hunk["lines"].append({"added": False, "content": line[1:]})

        if current_hunk:
            hunks.append(current_hunk)

        return hunks

    def to_dict(self):
        """Get a dict representation of this object (for API use)."""
        return dict(
            repository=self.repository,
            name=self.path.name,
            path=str(self.path),
            type_=str(self.type_),
            color=self.color,
            staged=self.staged,
        )


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
