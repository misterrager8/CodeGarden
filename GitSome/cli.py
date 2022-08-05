import click
from GitSome import create_app, config
from GitSome.models import Project
import os

app = create_app(config)


@click.group()
def cli():
    pass


@cli.command()
def list_all():
    with app.app_context():
        for i in Project.query.all():
            click.secho(
                "%s - %s TODO(S)"
                % (i.name, i.get_todos(filter_='status = "Todo"').count()),
                fg="green",
            )


@cli.command()
@click.argument("name")
def make_new(name):
    os.mkdir(name)
    with open(f"{name}/README.md", "w") as f:
        f.write(f"# {name}\n---\n")
    click.secho(f"Folder {name} created.", fg="green")


@cli.command()
def web():
    app.run()
