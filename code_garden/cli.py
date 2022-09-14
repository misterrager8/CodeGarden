from pathlib import Path

import click
import webview

from code_garden import config, create_app
from code_garden.models import Repo

HOME_DIR = Path(config.HOME_DIR)


@click.group()
def cli():
    """CodeGarden CLI Interface"""
    pass


@cli.command()
def web():
    """Launch web ui."""
    app = create_app(config)
    app.run(port=config.PORT)


@cli.command()
def desktop():
    """Launch desktop ui."""
    app = create_app(config)
    webview.create_window(
        "CodeGarden", app, text_select=True, frameless=True, width=1000
    )
    webview.start()


@cli.command()
def list():
    """List all repos."""
    for i in Repo.all():
        click.secho(f"{i.name} ({len(i.get_todos())} todo(s))", fg=config.CLI_COLOR)


@cli.command()
@click.option("--name", "-n", prompt=True)
@click.option("--desc", "-d", prompt=True)
def create(name, desc):
    """Create a new repo."""
    repo_ = Repo(HOME_DIR / name)
    repo_.create(desc)

    click.secho("Created.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--name", "-n", prompt=True)
def list_todos(name):
    """List all todos in a repo."""
    repo_ = Repo(HOME_DIR / name)

    for idx, i in enumerate(repo_.get_todos()):
        click.secho(f"[{idx}] {i}", fg=config.CLI_COLOR)


@cli.command()
@click.option("--name", "-n", prompt=True)
@click.option("--todo", "-t", prompt=True)
def add_todo(name, todo):
    """Add a todo to a repo."""
    repo_ = Repo(HOME_DIR / name)
    open(repo_.path / "todo.txt", "a").write(todo + "\n")

    click.secho("Todo added.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--name", "-n", prompt=True)
@click.option("--cmd", "-c", prompt="git ")
def git(name, cmd):
    """Run a git command for the repo."""
    repo_ = Repo(HOME_DIR / name)
    click.secho(repo_.git(["git", cmd]), fg=config.CLI_COLOR)
