import webbrowser

import click
import requests

from code_garden import config, create_app
from code_garden.models import Repository


@click.group()
def cli():
    pass


@cli.command()
@click.option(
    "--name", "-n", prompt="\n".join([i.name for i in Repository.all()]) + "\n"
)
def todos(name: str):
    repo_ = Repository(config.HOME_DIR / name)
    for i in repo_.todos:
        if i.data["done"] == False:
            click.secho(i.data["description"], fg="green")


@cli.command()
@click.option("--name", "-n")
@click.option("--description", "-d", prompt=True)
def new(name: str, description: str):
    name_ = (
        name
        or f"{requests.get('http://random-word-form.herokuapp.com/random/adjective').json()[0]}-{requests.get('https://random-word-form.herokuapp.com/random/noun').json()[0]}"
    )
    repo_ = Repository(config.HOME_DIR / name_)
    repo_.init(description)

    click.secho(f"{name_} created.", fg="green")


@cli.command()
@click.option("--debug", "-d", is_flag=True)
def web(debug: bool):
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}/")
    app.config["ENV"] = "development" if debug else "production"
    app.run(port=config.PORT, debug=debug)
