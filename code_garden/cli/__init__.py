import webbrowser

import click

from code_garden import config, create_app
from code_garden.cli.repos import repos
from code_garden.cli.todos import todos


@click.group()
def main():
    pass


@main.command()
@click.option("--switch", "-s", is_flag=True)
def web(switch):
    app = create_app(config)
    if switch:
        webbrowser.open(f"http://127.0.0.1:{config.PORT}/")
    app.run(port=config.PORT)


cli = click.CommandCollection(sources=[main, repos, todos])
