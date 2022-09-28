import click

from code_garden import config, create_app
from code_garden.cli.repos import repos
from code_garden.cli.todos import todos


@click.group()
def main():
    pass


@main.command()
def web():
    app = create_app(config)
    app.run()


cli = click.CommandCollection(sources=[main, repos, todos])
