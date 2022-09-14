from pathlib import Path

from flask import Blueprint, redirect, request

from code_garden import config
from code_garden.models import Repo, Todo

HOME_DIR = Path(config.HOME_DIR)
todos = Blueprint("todos", __name__)


@todos.route("/add_todo", methods=["POST"])
def add_todo():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    todos_ = repo_.get_todos()
    todos_.append(Todo(request.form["description"], False))

    repo_.set_todos(todos_)

    return redirect(request.referrer)


@todos.route("/mark_todo")
def mark_todo():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    todos_ = repo_.get_todos()
    todo_ = todos_[int(request.args.get("idx"))]

    todo_.done = not todo_.done
    repo_.set_todos(todos_)

    return redirect(request.referrer)


@todos.route("/edit_todo", methods=["POST"])
def edit_todo():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    todos_ = repo_.get_todos()
    todo_ = todos_[int(request.args.get("idx"))]

    todo_.description = request.form["description"]
    repo_.set_todos(todos_)

    return redirect(request.referrer)


@todos.route("/delete_todo")
def delete_todo():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    todos_ = repo_.get_todos()

    todos_.pop(int(request.args.get("idx")))
    repo_.set_todos(todos_)

    return redirect(request.referrer)


@todos.route("/clear_todos")
def clear_todos():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    repo_.clear_todos()

    return redirect(request.referrer)
