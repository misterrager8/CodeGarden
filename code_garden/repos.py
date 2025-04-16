"""API for command-line functions."""

import datetime
import subprocess
from pathlib import Path
from pprint import pformat

import click

from code_garden.models import Repository
from code_garden.todos import Todo


@click.group()
def repo_cli():
    pass


@repo_cli.command()
@click.option("--name")
def add_repo(name):
    """Create a new repo."""
    repo_ = Repository(name or Repository.generate_name())
    repo_.init(f"Created {datetime.date.today().strftime('%d/%m/%Y')}")

    click.secho(f"{repo_.name} initiated.", fg="green")


@repo_cli.command()
@click.argument("title")
@click.option("--desc", "-d", help="More detailed description of task.")
@click.option("--tag", "-t", help="One-word descriptor of task for sorting.")
@click.option("--fixup", "-f", is_flag=True, help="Capitalize input (convenience).")
def commit(title: str, desc, tag, fixup):
    """Commit changes to git using task info as the commit message."""
    todo_ = Todo(
        title.capitalize() if fixup else title,
        desc,
        tag,
        datetime.datetime.now(),
        "open",
        Path.cwd().name,
    )

    if click.confirm(f"Commit {todo_.title}?", default=True):
        todo_.status = "completed"
        todo_.add()

        click.secho(
            subprocess.run(
                [
                    "git",
                    "commit",
                    "-am",
                    f"({todo_.tag or datetime.date.today().strftime('%d/%m/%Y')}) {todo_.title}",
                ],
                cwd=Path.cwd(),
                text=True,
                capture_output=True,
            ).stdout,
            fg="blue",
        )
    else:
        click.secho("Nevermind.", fg="red")


@repo_cli.command()
def generate_name():
    """Generate a random placeholder name for a new repo."""
    click.secho(Repository.generate_name(), fg="green")


@repo_cli.command()
@click.argument("name")
def view_repo(name):
    """View all attributes of a repo for exporting."""
    repo_ = Repository(name)

    click.secho(pformat(repo_.to_dict()), fg="green")


@repo_cli.command()
def view_repos():
    """See a list of all repos found in the home directory."""
    click.secho("\n".join([str(i) for i in Repository.all()]), fg="green")


@repo_cli.command()
@click.argument("name")
def delete_repo(name):
    """Delete a repo."""
    repo_ = Repository(name)
    if click.confirm(f"Delete {repo_.name}?", default=True):
        repo_.delete()

    click.secho(f"Deleted.", fg="green")
