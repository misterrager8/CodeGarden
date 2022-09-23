import subprocess

import click

from code_garden import config


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
    subprocess.run(["git", "add", "-A"], cwd=dir)
    click.secho(
        subprocess.run(
            ["git", "commit", "-m", f"{type}: {msg}"],
            cwd=dir,
            capture_output=True,
            text=True,
        ).stdout,
        fg=config.CLI_COLOR,
    )


@cli.command()
@click.argument("dir")
def status(dir):
    """Git status."""
    click.secho(
        subprocess.run(
            ["git", "status"], cwd=dir, capture_output=True, text=True
        ).stdout,
        fg=config.CLI_COLOR,
    )


@cli.command()
@click.argument("dir")
@click.argument("limit", type=int, default=5)
def log(dir, limit):
    """Git log."""
    click.secho(
        subprocess.run(
            ["git", "log", "--branches", "--pretty=format:[%ar] %s", f"-{str(limit)}"],
            cwd=dir,
            capture_output=True,
            text=True,
        ).stdout,
        fg=config.CLI_COLOR,
    )


@cli.command()
@click.argument("dir")
def branches(dir):
    """Git branches."""
    click.secho(
        subprocess.run(
            ["git", "branch"], cwd=dir, capture_output=True, text=True
        ).stdout,
        fg=config.CLI_COLOR,
    )


@cli.command()
@click.argument("dir")
@click.option("--name", "-n", prompt=True)
def new_branch(dir, name):
    """Create a branch."""
    click.secho(
        subprocess.run(
            ["git", "checkout", "-b", name], cwd=dir, capture_output=True, text=True
        ).stdout,
        fg=config.CLI_COLOR,
    )


@cli.command()
@click.argument("dir")
@click.option("--branch", "-b", prompt=True)
def checkout(dir, branch):
    """Checkout a branch."""
    click.secho(
        subprocess.run(
            ["git", "checkout", branch], cwd=dir, capture_output=True, text=True
        ).stdout,
        fg=config.CLI_COLOR,
    )
