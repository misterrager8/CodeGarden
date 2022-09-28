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
    for i in Repository(dir).todos:
        click.secho(i, fg=config.CLI_COLOR)


@todos.command()
@click.argument("dir")
@click.option("--task", "-t", prompt=True)
def add_todo(dir, task):
    """Add a todo."""
    open(Repository(dir).path / "todo.txt", "a").write(f"{task}\n")
    click.secho("Todo added.", fg=config.CLI_COLOR)
