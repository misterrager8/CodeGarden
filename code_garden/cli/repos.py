import os

import click

from code_garden import config
from code_garden.models import Repository


@click.group()
def repos():
    pass


@repos.command()
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
@click.option("--msg", "-m", prompt=True)
def commit(dir, type, msg):
    """Make a commit."""
    click.secho(Repository(dir).commit(f"{type}: {msg}"), fg=config.CLI_COLOR)


@repos.command()
@click.option("--dir", "-d", default=os.getcwd())
def status(dir):
    """Git status."""
    click.secho(Repository(dir).status, fg=config.CLI_COLOR)


@repos.command()
@click.option("--dir", "-d", default=os.getcwd())
@click.argument("limit", type=int, default=5)
def log(dir, limit):
    """Git log."""
    for i in Repository(dir).log(limit):
        click.secho(i, fg=config.CLI_COLOR)


@repos.command()
@click.option("--dir", "-d", default=os.getcwd())
def branches(dir):
    """Git branches."""
    click.secho(Repository(dir).branches, fg=config.CLI_COLOR)


@repos.command()
@click.option("--dir", "-d", default=os.getcwd())
def branch(dir):
    """Git current branch."""
    click.secho(Repository(dir).branch, fg=config.CLI_COLOR)


@repos.command()
@click.option("--dir", "-d", default=os.getcwd())
@click.option("--name", "-n", prompt=True)
def new_branch(dir, name):
    """Create a branch."""
    click.secho(Repository(dir).create_branch(name), fg=config.CLI_COLOR)


@repos.command()
@click.option("--dir", "-d", default=os.getcwd())
@click.option("--branch", "-b", prompt=True)
def checkout(dir, branch):
    """Checkout a branch."""
    click.secho(Repository(dir).checkout(branch), fg=config.CLI_COLOR)
