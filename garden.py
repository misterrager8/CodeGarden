import subprocess

import click


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
)
@click.option("--msg", "-m", prompt=True)
def commit(dir, type, msg):
    """Make a commit."""
    subprocess.run(["git", "add", "-A"], cwd=dir)
    subprocess.run(["git", "commit", "-m", f"{type}: {msg}"], cwd=dir)
