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
@click.option("--port", "-p", default="5000")
def web(debug: bool, port):
    """Launch web interface for CodeGarden.

    Args:
        debug (bool): Debug mode
    """
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{port}/")
    app.config["ENV"] = "development" if debug else "production"
    app.run(port=port, debug=debug)


cli = click.CommandCollection(sources=[main_cli, todos_cli, readme_cli, repo_cli])


def main():
    cli()
