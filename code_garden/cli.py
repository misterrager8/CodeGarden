import click

from code_garden import config
from code_garden.models import Repository


@click.group()
def cli():
    pass


@cli.command()
@click.argument("dir")
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


@cli.command()
@click.argument("dir")
def status(dir):
    """Git status."""
    click.secho(Repository(dir).status, fg=config.CLI_COLOR)


@cli.command()
@click.argument("dir")
@click.argument("limit", type=int, default=5)
def log(dir, limit):
    """Git log."""
    click.secho(Repository(dir).log(limit), fg=config.CLI_COLOR)


@cli.command()
@click.argument("dir")
def branches(dir):
    """Git branches."""
    click.secho(Repository(dir).branches, fg=config.CLI_COLOR)


@cli.command()
@click.argument("dir")
def branch(dir):
    """Git current branch."""
    click.secho(Repository(dir).branch, fg=config.CLI_COLOR)


@cli.command()
@click.argument("dir")
@click.option("--name", "-n", prompt=True)
def new_branch(dir, name):
    """Create a branch."""
    click.secho(Repository(dir).create_branch(name), fg=config.CLI_COLOR)


@cli.command()
@click.argument("dir")
@click.option("--branch", "-b", prompt=True)
def checkout(dir, branch):
    """Checkout a branch."""
    click.secho(Repository(dir).checkout(branch), fg=config.CLI_COLOR)
