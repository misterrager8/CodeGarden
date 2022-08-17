from pathlib import Path

import click
import pyperclip

from GitSome import config, create_app, db
from GitSome.models import Repo, Todo

app = create_app(config)


@click.group()
def cli():
    """GitSome CLI Interface"""
    pass


@cli.command()
def list_all():
    """List all repos in DB"""
    with app.app_context():
        for i in Repo.query.all():
            click.secho(
                "[%s] %s - %s TODO(S)"
                % (i.id, i.name, i.get_todos(filter_="not done").count()),
                fg="cyan",
            )


@cli.command()
@click.argument("id")
def list_todos(id):
    """Print all todos of the repo with given ID"""
    with app.app_context():
        repo_ = Repo.query.get(int(id))
        for i in repo_.get_todos(filter_="not done"):
            click.secho("[%s] %s" % (i.id, i.task), fg="cyan")


@cli.command()
@click.argument("fullpath")
def make_new(fullpath):
    """Make a new project from scratch located in the given FULLPATH"""
    path_ = Path(fullpath)

    path_.mkdir()
    with app.app_context():
        repo_ = Repo(name=path_.name, filepath=fullpath, pinned=True)
        db.session.add(repo_)
        db.session.commit()

        repo_.git_command("git init")

    with open(path_ / "README.md", "w") as f:
        f.write(f"# {path_.name}\n---\n")

    click.secho(f"Folder {path_.name} created.", fg="cyan")


@cli.command()
@click.argument("id")
@click.argument("task")
def add_todo(id, task):
    """Add a to do TASK the repo given by ID"""
    with app.app_context():
        repo_ = Repo.query.get(int(id))
        todo_ = Todo(task=task, repo_id=repo_.id)
        db.session.add(todo_)
        db.session.commit()

    click.secho("Todo added.", fg="cyan")


@cli.command()
@click.argument("id")
def commit_todo(id):
    """Make a commit in git with Todo given by ID as msg in"""
    with app.app_context():
        todo_ = Todo.query.get(int(id))
        todo_.commit()

    click.secho("Todo committed.", fg="cyan")


@cli.command()
@click.argument("id")
def delete_repo(id):
    """Delete the repo with given ID"""
    with app.app_context():
        repo_ = Repo.query.get(int(id))
        db.session.delete(repo_)
        db.session.commit()

        click.secho("Deleted.", fg="cyan")


@cli.command()
@click.argument("id")
def copy_path(id):
    """Copy the repo's filepath with given ID"""
    with app.app_context():
        repo_ = Repo.query.get(int(id))
        pyperclip.copy(repo_.filepath)

        click.secho(f"Copied: {repo_.filepath}", fg="cyan")


@cli.command()
def web():
    """Launch browser interface for GitSome"""
    app.run(port=app.config["PORT"])
