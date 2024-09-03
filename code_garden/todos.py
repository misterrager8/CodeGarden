import datetime
import sqlite3
import subprocess
from pathlib import Path

import click

from code_garden.database import Connector

conn = Connector()
conn.write(
    "CREATE TABLE IF NOT EXISTS todos (title TEXT, description TEXT, tag TEXT, date_added DATETIME, status TEXT, repo TEXT, id INTEGER PRIMARY KEY AUTOINCREMENT)"
)


class Todo:
    status_options = {"open": "cyan", "active": "yellow", "completed": "blue"}

    def __init__(
        self,
        title: str,
        description: str,
        tag: str,
        date_added: datetime.datetime,
        status: str,
        repo: str,
        id: int = None,
    ):
        self.title = title
        self.description = description
        self.tag = tag
        self.date_added = date_added
        self.status = status
        self.repo = repo
        self.id = id

    def add(self):
        conn.write(
            "INSERT INTO todos (title, description, tag, date_added, status, repo) VALUES (?,?,?,?,?,?)",
            (
                self.title,
                self.description,
                self.tag,
                self.date_added,
                self.status,
                self.repo,
            ),
        )

    @classmethod
    def get(cls, id):
        result = conn.read(
            "SELECT title, description, tag, date_added, status, repo, id FROM todos WHERE id=?",
            (str(id),),
        )[0]
        return Todo(
            result[0], result[1], result[2], result[3], result[4], result[5], result[6]
        )

    @classmethod
    def see_list(cls, repo):
        results = conn.read(
            "SELECT title, description, tag, date_added, status, repo, id FROM todos WHERE repo=?",
            (repo,),
        )
        n = sorted(
            [Todo(i[0], i[1], i[2], i[3], i[4], i[5], i[6]) for i in results],
            key=lambda x: x.id,
            reverse=True,
        )
        return sorted(n, key=lambda x: (x.status == "completed", x.status != "active"))

    def edit(self):
        conn.write(
            "UPDATE todos SET title=?, description=?, tag=?, status=? WHERE id=?",
            (self.title, self.description, self.tag, self.status, str(self.id)),
        )

    def delete(self):
        conn.write("DELETE FROM todos WHERE id=?", (str(self.id),))

    def __str__(self):
        return "#{} {:40.40} ({})".format(
            str(self.id).ljust(2),
            self.title,
            self.tag or datetime.date.today().strftime("%d/%m/%Y"),
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.title,
            "tag": self.tag,
            "description": self.description,
            "repository": self.repo,
            "done": self.status == "completed",
            "status": self.status,
        }


@click.group()
def todos_cli():
    pass


@todos_cli.command()
@click.argument("title")
@click.option("--desc", "-d", help="More detailed description of task.")
@click.option("--tag", "-t", help="One-word descriptor of task for sorting.")
@click.option("--fixup", "-f", is_flag=True, help="Capitalize input (convenience).")
def add_todo(title: str, desc, tag, fixup):
    """Add a task."""
    todo_ = Todo(
        title.capitalize() if fixup else title,
        desc,
        tag,
        datetime.datetime.now(),
        "open",
        Path.cwd().name,
    )
    todo_.add()
    click.secho(f"{todo_.title} added.", fg="green")


@todos_cli.command()
@click.option(
    "-a", "--all", is_flag=True, default=False, help="Include completed todos."
)
def view_todos(all):
    """See list of all undone todos."""
    _ = (
        Todo.see_list(Path.cwd().name)
        if all
        else [i for i in Todo.see_list(Path.cwd().name) if i.status != "completed"]
    )
    for i in _:
        click.secho(str(i), fg=Todo.status_options.get(i.status))


@todos_cli.command()
@click.argument("id")
def view_todo(id):
    """Get a task and see detailed info."""
    todo_ = Todo.get(int(id))
    display = "\n\n".join(
        [
            todo_.title,
            todo_.status,
            todo_.tag or "(No Tag)",
            todo_.description or "(No Description)",
            todo_.date_added,
        ]
    )
    click.secho(display, fg=Todo.status_options.get(todo_.status))


@todos_cli.command()
@click.argument("id")
@click.option("--name", "-n", help="Name of task.")
@click.option("--desc", "-d", help="More detailed description of task.")
@click.option("--tag", "-t", help="One-word descriptor of task for sorting.")
@click.option(
    "--status",
    "-s",
    type=click.Choice(["open", "active", "completed"], case_sensitive=False),
    help="Status of task.",
)
def edit_todo(name, desc, tag, status, id):
    """Edit a task."""
    todo_ = Todo.get(int(id))
    todo_.title = name or todo_.title
    todo_.description = desc or todo_.description
    todo_.tag = tag or todo_.tag
    todo_.status = status or todo_.status

    todo_.edit()
    click.secho(f"{todo_.title} edited.", fg="green")


@todos_cli.command()
@click.argument("id")
def delete_todo(id):
    """Delete a task."""
    todo_ = Todo.get(int(id))
    if click.confirm(f"Delete {todo_.title}?", default=True):
        todo_.delete()
        click.secho(f"{todo_.title} deleted.", fg="green")
    else:
        click.secho("Nevermind.", fg="red")


@todos_cli.command()
@click.argument("id")
def todo_done(id):
    """Mark a task as complete."""
    todo_ = Todo.get(int(id))
    todo_.status = "completed"
    todo_.edit()

    click.secho(f"{todo_.title} completed.", fg="blue")


@todos_cli.command()
@click.argument("id")
def commit_todo(id):
    """Commit changes to git using task info as the commit message."""
    todo_ = Todo.get(int(id))

    if click.confirm(f"Commit {todo_.title}?", default=True):
        todo_.status = "completed"
        todo_.edit()

        click.secho(
            subprocess.run(
                [
                    "git",
                    "commit",
                    "-am",
                    f"({todo_.tag or datetime.date.today().strftime('%d/%m/%Y')}) {todo_.title}",
                ],
                cwd=Path.cwd(),
                text=True,
                capture_output=True,
            ).stdout,
            fg="blue",
        )
    else:
        click.secho("Nevermind.", fg="red")


@todos_cli.command()
@click.argument("id")
def pick_todo(id):
    """Mark a task as 'active' (currently being worked on)."""
    todo_ = Todo.get(int(id))
    todo_.status = "active"
    todo_.edit()

    click.secho(f"{todo_.title} active.", fg="yellow")
