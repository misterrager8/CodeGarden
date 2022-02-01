import datetime

from flask import render_template, redirect, request, current_app, url_for
from flask_login import login_user, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash

from ProjectManager import login_manager
from ProjectManager.ctrla import Database
from ProjectManager.models import Project, Todo, User

database = Database()


@login_manager.user_loader
def load_user(id_: int):
    return database.get(User, id_)


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    user = User.query.filter(User.username == username).first()

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
    user = User(username=request.form["username"],
                password=generate_password_hash(request.form["password"]))
    database.create(user)
    login_user(user)

    return redirect(url_for("index"))


@current_app.route("/project_create", methods=["POST"])
def project_create():
    database.create(Project(name=request.form["project_name"],
                            start_date=datetime.datetime.now().date(),
                            status="Planning",
                            user_id=current_user.id))
    return redirect(request.referrer)


@current_app.route("/project")
def project():
    project_: Project = database.get(Project, request.args.get("id_"))

    return render_template("project.html", project=project_)


@current_app.route("/project_edit", methods=["POST"])
def project_edit():
    project_: Project = database.get(Project, request.form["id_"])

    project_.name = request.form["project_name"]
    project_.readme = request.form["readme"] or None
    project_.start_date = request.form["start_date"]
    project_.status = request.form["status"]
    project_.github_url = request.form["github_url"] or None

    database.update()

    return redirect(request.referrer)


@current_app.route("/project_delete")
def project_delete():
    project_: Project = database.get(Project, request.args.get("id_"))
    database.delete(project_)

    return redirect(request.referrer)


@current_app.route("/tools")
def tools():
    return render_template("tools.html")


@current_app.route("/todo_create", methods=["POST"])
def todo_create():
    database.create(Todo(item=request.form["task"].capitalize(),
                         date_added=datetime.datetime.now().date(),
                         project_id=int(request.form["id_"])))

    return redirect(request.referrer)


@current_app.route("/todo_edit", methods=["POST"])
def todo_edit():
    todo_: Todo = database.get(Todo, request.form["id_"])
    todo_.item = request.form["item"]

    database.update()

    return redirect(request.referrer)


@current_app.route("/todo_mark", methods=["POST"])
def todo_mark():
    todo_: Todo = database.get(Todo, request.form["id_"])
    todo_.done = not todo_.done
    database.update()

    return redirect(request.referrer)


@current_app.route("/todo_delete")
def todo_delete():
    todo: Todo = database.get(Todo, request.args.get("id_"))
    database.delete(todo)

    return redirect(request.referrer)
