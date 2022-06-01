from flask import request, current_app, render_template, url_for, Blueprint
from ProjectManager.db_ import Database
from werkzeug.utils import redirect
import datetime
from ProjectManager.models import Project, Todo

from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import redirect

db = Database()

todos = Blueprint("todos", __name__)


@todos.route("/add_todo", methods=["POST"])
def add_todo():
    todo_ = Todo(
        desc=request.form["desc"],
        date_added=datetime.datetime.now(),
        project=request.form["id_"],
    )
    db.create(todo_)
    return redirect(request.referrer)


@todos.route("/edit_todo", methods=["POST"])
def edit_todo():
    todo_: Todo = db.get(Todo, int(request.form["id_"]))
    todo_.desc = request.form["desc"]
    db.update()
    return redirect(request.referrer)


@todos.route("/delete_todo")
def delete_todo():
    todo_: Todo = db.get(Todo, int(request.args.get("id_")))
    db.delete(todo_)
    return redirect(request.referrer)


@todos.route("/mark_todo")
def mark_todo():
    todo_: Todo = db.get(Todo, int(request.args.get("id_")))
    todo_.done = not todo_.done
    db.update()
    return redirect(request.referrer)


@todos.route("/commit_todo")
def commit_todo():
    todo_: Todo = db.get(Todo, int(request.args.get("id_")))
    todo_.mark_and_commit()
    db.update()
    return redirect(request.referrer)
