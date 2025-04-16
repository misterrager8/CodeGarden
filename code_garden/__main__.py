"""Main CLI"""

import pprint
import webbrowser

import click

from code_garden.readme import readme_cli
from code_garden.repos import repo_cli
from code_garden.todos import todos_cli

from . import config
from .web import create_app


@click.group()
def main_cli():
    pass


@main_cli.command()
@click.option("--debug", "-d", is_flag=True)
def web(debug: bool):
    """Launch web interface for CodeGarden.

    Args:
        debug (bool): Debug mode
    """
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}/")
    app.config.update({"ENV": "development" if debug else "production"})
    app.run(port=config.PORT, debug=debug)


@main_cli.command()
def get_config():
    """View current settings for web and command-line interfaces."""
    click.secho(pprint.pformat(config.get()), fg="green")


@main_cli.command()
@click.argument("key")
@click.argument("value")
def set_config(key, value):
    """Set config for web and command-line interfaces."""
    config.set(key, value)

    click.secho(f"{key} set to {value}", fg="green")


cli = click.CommandCollection(sources=[main_cli, todos_cli, readme_cli, repo_cli])


def main():
    cli()
