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
