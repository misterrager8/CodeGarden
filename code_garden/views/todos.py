from flask import Blueprint, redirect, request

from code_garden.models import Repository

todos = Blueprint("todos", __name__)


@todos.route("/add_todo", methods=["POST"])
def add_todo():
    repo_ = Repository(request.args.get("path"))
    open(repo_.path / "todo.txt", "a").write(f"{request.form['description']}\n")

    return redirect(request.referrer)


@todos.route("/delete_todo")
def delete_todo():
    repo_ = Repository(request.args.get("path"))
    todos_ = repo_.todos

    todos_.pop(int(request.args.get("idx")))
    repo_.save_todos(todos_)

    return redirect(request.referrer)


@todos.route("/edit_todo", methods=["POST"])
def edit_todo():
    repo_ = Repository(request.args.get("path"))
    todos_ = repo_.todos

    todos_[int(request.args.get("idx"))] = request.form["description"]
    repo_.save_todos(todos_)

    return redirect(request.referrer)
