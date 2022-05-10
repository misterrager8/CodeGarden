from flask import current_app
from flask_login import current_user, login_user
from werkzeug.security import check_password_hash
import click
from ProjectManager.models import User


@current_app.cli.command()
@click.option("--username", prompt=True)
@click.password_option()
def list_projects(username: str, password: str):
    user_: User = User.query.filter(User.username == username).first()
    if user_ and check_password_hash(user_.password, password):
        login_user(user_)
        for i in current_user.projects:
            print(i)
        else:
            return "Login failed."


if __name__ == "__main__":
    list_projects()
