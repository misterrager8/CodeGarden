import os

import click

from code_garden import config
from code_garden.models import Repository


@click.group()
def todos():
    pass


@todos.command()
@click.option("--dir", "-d", default=os.getcwd())
def list_todos(dir):
    """List todos."""
    for idx, i in enumerate(Repository(dir).todos):
        click.secho(f"[{str(idx)}] {i}", fg=config.CLI_COLOR)


@todos.command()
@click.option("--dir", "-d", default=os.getcwd())
@click.option("--task", "-t", prompt=True)
def add_todo(dir, task):
    """Add a todo."""
    open(Repository(dir).path / "todo.txt", "a").write(f"{task}\n")
    click.secho("Todo added.", fg=config.CLI_COLOR)


@todos.command()
@click.option("--dir", "-d", default=os.getcwd())
@click.option("--idx", "-i", type=int)
@click.option("--change", "-c", prompt=True)
def edit_todo(dir, idx, change):
    """Edit a todo."""
    todos_ = Repository(dir).todos
    todos_[idx] = change

    Repository(dir).save_todos(todos_)

    click.secho("Todo edited.", fg=config.CLI_COLOR)


@todos.command()
@click.option("--dir", "-d", default=os.getcwd())
@click.option("--idx", "-i", type=int)
def delete_todo(dir, idx):
    """Delete a todo."""
    todos_ = Repository(dir).todos
    todos_.pop(idx)

    Repository(dir).save_todos(todos_)

    click.secho("Todo deleted.", fg=config.CLI_COLOR)


@todos.command()
@click.option("--dir", "-d", default=os.getcwd())
@click.option(
    "--type",
    "-t",
    type=click.Choice(
        ["FIX", "TWEAK", "REFACTOR", "FEATURE", "STYLE", "DOCS", "CHORE"],
        case_sensitive=False,
    ),
    prompt=True,
    show_choices=True,
)
@click.option("--idx", "-i", type=int)
def commit_todo(dir, type, idx):
    """Commit a todo."""
    todos_ = Repository(dir).todos
    todo_ = todos_[idx]

    click.secho(Repository(dir).commit(f"{type}: {todo_}"), fg=config.CLI_COLOR)
