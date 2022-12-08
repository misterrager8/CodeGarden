from flask import Blueprint, redirect, request

from code_garden import config
from code_garden.models import Repository, Todo

todos = Blueprint("todos", __name__)


@todos.route("/create_todo", methods=["POST"])
def create_todo():
    repo_ = Repository(config.HOME_DIR / request.form.get("name"))
    todos_ = repo_.todos
    todos_.append(
        Todo(
            dict(
                description=request.form.get("description"),
                done=False,
                category=request.form.get("category"),
            )
        )
    )

    repo_.set_todos(todos_)

    return redirect(request.referrer)


@todos.route("/edit_todo", methods=["POST"])
def edit_todo():
    repo_ = Repository(config.HOME_DIR / request.form.get("name"))
    todos_ = repo_.todos
    todos_[int(request.form.get("id"))].data["description"] = request.form.get(
        "description"
    )

    repo_.set_todos(todos_)

    return redirect(request.referrer)


@todos.route("/toggle_todo")
def toggle_todo():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    todos_ = repo_.todos
    todos_[int(request.args.get("id"))].toggle()

    repo_.set_todos(todos_)

    return redirect(request.referrer)


@todos.route("/delete_todo")
def delete_todo():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    todos_ = repo_.todos
    del todos_[int(request.args.get("id"))]

    repo_.set_todos(todos_)

    return redirect(request.referrer)


@todos.route("/commit_todo")
def commit_todo():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    todos_ = repo_.todos
    repo_.commit(todos_[int(request.args.get("id"))].to_string())
    todos_[int(request.args.get("id"))].toggle()

    repo_.set_todos(todos_)

    return redirect(request.referrer)


@todos.route("/clear_completed")
def clear_completed():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    todos_ = repo_.todos

    repo_.set_todos([i for i in todos_ if not i.data["done"]])

    return redirect(request.referrer)
