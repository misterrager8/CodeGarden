from flask import request, current_app, render_template, url_for
from . import login_manager
from ProjectManager.db_ import Database
from werkzeug.utils import redirect
import datetime
from ProjectManager.models import User, Project, Todo

from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import redirect

db = Database()


@login_manager.user_loader
def load_user(id_: int):
    return User.query.get(id_)


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@current_app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    user_: User = User.query.filter(User.username == username).first()
    if user_ and check_password_hash(user_.password, password):
        login_user(user_)
        return redirect(url_for("index"))
    else:
        return "Login failed."


@current_app.route("/signup", methods=["POST"])
def signup():
    username = request.form["username"]
    password = request.form["password"]

    user_ = User(username=username, password=generate_password_hash(password))
    db.create(user_)
    login_user(user_)

    return redirect(url_for("index"))


@current_app.route("/add_project", methods=["POST"])
def add_project():
    project_ = Project(name=request.form["name"], user=current_user.id)
    db.create(project_)
    return redirect(request.referrer)


@current_app.route("/project_")
def project_():
    project_: Project = db.get(Project, int(request.args.get("id_")))
    return render_template("project.html", project_=project_)


@current_app.route("/edit_project", methods=["POST"])
def edit_project():
    project_: Project = db.get(Project, int(request.form["id_"]))
    project_.name = request.form["name"]
    project_.tagline = request.form["tagline"]
    project_.readme = request.form["readme"]
    db.update()
    return redirect(request.referrer)


@current_app.route("/delete_project")
def delete_project():
    project_: Project = db.get(Project, int(request.args.get("id_")))
    db.delete_multiple([i for i in project_.todos])
    db.delete(project_)
    return redirect(request.referrer)


@current_app.route("/add_todo", methods=["POST"])
def add_todo():
    todo_ = Todo(
        desc=request.form["desc"],
        date_added=datetime.datetime.now(),
        user=current_user.id,
        project=request.form["id_"],
    )
    db.create(todo_)
    return redirect(request.referrer)


@current_app.route("/edit_todo", methods=["POST"])
def edit_todo():
    todo_: Todo = db.get(Todo, int(request.form["id_"]))
    todo_.desc = request.form["desc"]
    db.update()
    return redirect(request.referrer)


@current_app.route("/delete_todo")
def delete_todo():
    todo_: Todo = db.get(Todo, int(request.args.get("id_")))
    db.delete(todo_)
    return redirect(request.referrer)


@current_app.route("/mark_todo")
def mark_todo():
    todo_: Todo = db.get(Todo, int(request.args.get("id_")))
    todo_.done = not todo_.done
    db.update()
    return redirect(request.referrer)
