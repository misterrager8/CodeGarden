import click

from code_garden import config
from code_garden.models import Repository


@click.group()
def todos():
    pass


@todos.command()
@click.argument("dir")
def list_todos(dir):
    """List todos."""
    for idx, i in enumerate(Repository(dir).todos):
        click.secho(f"[{str(idx)}] {i}", fg=config.CLI_COLOR)


@todos.command()
@click.argument("dir")
@click.option("--task", "-t", prompt=True)
def add_todo(dir, task):
    """Add a todo."""
    open(Repository(dir).path / "todo.txt", "a").write(f"{task}\n")
    click.secho("Todo added.", fg=config.CLI_COLOR)


@todos.command()
@click.argument("dir")
@click.option("--idx", "-i", type=int)
def delete_todo(dir, idx):
    """Delete a todo."""
    todos_ = Repository(dir).todos
    todos_.pop(idx)

    Repository(dir).save_todos(todos_)

    click.secho("Todo deleted.", fg=config.CLI_COLOR)
