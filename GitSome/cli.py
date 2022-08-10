import click
from GitSome import create_app, config, db
from GitSome.models import Project, Todo
from pathlib import Path

app = create_app(config)


@click.group()
def cli():
    pass


@cli.command()
def list_all():
    with app.app_context():
        for i in Project.query.all():
            click.secho(
                "[%s] %s - %s TODO(S)"
                % (i.id, i.name, i.get_todos(filter_='status = "Todo"').count()),
                fg="cyan",
            )


@cli.command()
@click.argument("id")
def list_todos(id):
    with app.app_context():
        project_ = Project.query.get(int(id))
        for i in project_.get_todos(filter_='status = "Todo"'):
            click.secho("[%s] %s" % (i.id, i.task), fg="cyan")


@cli.command()
@click.argument("fullpath")
def make_new(fullpath):
    path_ = Path(fullpath)

    path_.mkdir()
    with app.app_context():
        project_ = Project(name=path_.name, filepath=fullpath, pinned=True)
        db.session.add(project_)
        db.session.commit()

        project_.git_command("git init")

    with open(path_ / "README.md", "w") as f:
        f.write(f"# {path_.name}\n---\n")

    click.secho(f"Folder {path_.name} created.", fg="cyan")


@cli.command()
@click.argument("id")
@click.argument("task")
def add_todo(id, task):
    with app.app_context():
        project_ = Project.query.get(int(id))
        todo_ = Todo(task=task, project_id=project_.id)
        db.session.add(todo_)
        db.session.commit()

    click.secho("Todo added.", fg="cyan")


@cli.command()
@click.argument("id")
def commit_todo(id):
    with app.app_context():
        todo_ = Todo.query.get(int(id))
        todo_.commit()

    click.secho("Todo committed.", fg="cyan")


@cli.command()
@click.argument("id")
def delete_project(id):
    with app.app_context():
        project_ = Project.query.get(int(id))
        db.session.delete(project_)
        db.session.commit()

        click.secho("Deleted.", fg="cyan")


@cli.command()
def web():
    app.run(port=app.config["PORT"])
