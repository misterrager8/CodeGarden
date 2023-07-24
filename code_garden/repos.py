import datetime
from pprint import pformat

import click

from code_garden.models import Repository


@click.group()
def repo_cli():
    pass


@repo_cli.command()
@click.option("--name")
def add_repo(name):
    repo_ = Repository(name or Repository.generate_name())
    repo_.init(f"Created {datetime.date.today().strftime('%d/%m/%Y')}")

    click.secho(f"{repo_.name} initiated.", fg="green")


@repo_cli.command()
@click.argument("name")
def view_repo(name):
    repo_ = Repository(name)

    click.secho(pformat(repo_.to_dict()), fg="green")


@repo_cli.command()
def view_repos():
    click.secho("\n".join([str(i) for i in Repository.all()]), fg="green")


@repo_cli.command()
@click.argument("name")
def delete_repo(name):
    repo_ = Repository(name)
    if click.confirm(f"Delete {repo_.name}?", default=True):
        repo_.delete()

    click.secho(f"Deleted.", fg="green")
