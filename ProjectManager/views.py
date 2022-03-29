import datetime

from flask import render_template, current_app, request, url_for
from flask_login import login_user, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import redirect

from ProjectManager import login_manager
from ProjectManager.ctrla import Database
from ProjectManager.models import User, Project

database = Database()


@login_manager.user_loader
def load_user(id_: int):
    return User.query.get(id_)


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    user: User = User.query.filter(User.username == username).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return redirect(url_for("index"))
    else:
        return "Login failed."


@current_app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@current_app.route("/signup", methods=["POST"])
def signup():
    username = request.form["username"]
    password = request.form["password"]
    password_confirm = request.form["password_confirm"]

    if password == password_confirm:
        _ = User(username=username, password=generate_password_hash(password), date_created=datetime.datetime.now())
        database.add(_)
        login_user(_)
        return redirect(url_for("index"))
    else:
        return "Try again."


@current_app.route("/change_account", methods=["POST"])
def change_account():
    current_user.username = request.form["username"]
    database.update()

    return redirect(request.referrer)


@current_app.route("/change_password", methods=["POST"])
def change_password():
    old_password = request.form["old_password"]
    new_password = request.form["new_password"]
    new_password_confirm = request.form["new_password_confirm"]

    if check_password_hash(current_user.password, old_password) and new_password == new_password_confirm:
        current_user.password = generate_password_hash(new_password)
        database.update()
    else:
        return "Try again."

    return redirect(request.referrer)


@current_app.route("/delete_account")
def delete_account():
    database.delete(current_user)

    return redirect(url_for("index"))


@current_app.route("/project_create", methods=["POST"])
def project_create():
    project_ = Project(name=request.form["name"], user=current_user.id)
    database.add(project_)

    return redirect(request.referrer)


@current_app.route("/project")
def project():
    project_: Project = database.get(Project, int(request.args.get("id_")))
    return render_template("project.html", project_=project_)


@current_app.route("/project_edit", methods=["POST"])
def project_edit():
    project_: Project = database.get(Project, int(request.form["id_"]))
    project_.name = request.form["name"]
    database.update()

    return redirect(request.referrer)


@current_app.route("/project_delete")
def project_delete():
    project_: Project = database.get(Project, int(request.args.get("id_")))
    database.delete(project_)

    return redirect(request.referrer)
