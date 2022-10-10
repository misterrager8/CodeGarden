from flask import Blueprint, redirect, request

from code_garden import config
from code_garden.models import Repository, Todo

todos = Blueprint("todos", __name__)


@todos.route("/add_todo", methods=["POST"])
def add_todo():
    repo_ = Repository(config.HOME_DIR / request.form["name"])
    todos_ = repo_.todos

    todos_.insert(0, Todo(f"{request.form['type']}: {request.form['description']}"))
    repo_.save_todos(todos_)

    return redirect(request.referrer)


@todos.route("/delete_todo")
def delete_todo():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    todos_ = repo_.todos

    todos_.pop(int(request.args.get("idx")))
    repo_.save_todos(todos_)

    return redirect(request.referrer)


@todos.route("/clear_completed")
def clear_completed():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    repo_.clear_completed()

    return redirect(request.referrer)


@todos.route("/mark_todo")
def mark_todo():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    todos_ = repo_.todos

    todos_[int(request.args.get("idx"))].mark()
    repo_.save_todos(todos_)

    return redirect(request.referrer)


@todos.route("/commit_todo")
def commit_todo():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    todos_ = repo_.todos

    todos_[int(request.args.get("idx"))].mark()
    repo_.save_todos(todos_)
    repo_.commit(todos_[int(request.args.get("idx"))].name)

    return redirect(request.referrer)


@todos.route("/edit_todo", methods=["POST"])
def edit_todo():
    repo_ = Repository(config.HOME_DIR / request.form["name"])
    todos_ = repo_.todos

    todos_[int(request.form["idx"])].name = request.form["description"]
    repo_.save_todos(todos_)

    return redirect(request.referrer)
