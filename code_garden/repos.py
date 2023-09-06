import datetime
from pathlib import Path
from pprint import pformat
import subprocess

import click

from code_garden.models import Repository
from code_garden.todos import Task


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
@click.argument("title")
@click.option("--desc", "-d", help="More detailed description of task.")
@click.option("--tag", "-t", help="One-word descriptor of task for sorting.")
@click.option("--fixup", "-f", is_flag=True, help="Capitalize input (convenience).")
def commit(title: str, desc, tag, fixup):
    """Commit changes to git using task info as the commit message."""
    task_ = Task(
        title.capitalize() if fixup else title,
        desc,
        tag,
        datetime.datetime.now(),
        "open",
    )

    if click.confirm(f"Commit {task_.title}?", default=True):
        task_.status = "completed"
        task_.add()

        click.secho(
            subprocess.run(
                [
                    "git",
                    "commit",
                    "-am",
                    f"({task_.tag or datetime.date.today().strftime('%d/%m/%Y')}) {task_.title}",
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
    click.secho(Repository.generate_name(), fg="green")


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
