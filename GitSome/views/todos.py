import markdown
from flask import Blueprint, redirect, render_template, request

from GitSome import db
from GitSome.models import Repo, Todo

todos = Blueprint("todos", __name__)


@todos.route("/add_todo", methods=["POST"])
def add_todo():
    repo_id = int(request.form["id_"])
    task = request.form["task"]

    todo_ = Todo(task=task, repo_id=repo_id)
    db.session.add(todo_)
    db.session.commit()

    return redirect(request.referrer)


@todos.route("/edit_todo", methods=["POST"])
def edit_todo():
    todo_ = Todo.query.get(int(request.form["id_"]))
    todo_.task = request.form["task"]
    todo_.note = request.form["note"]

    db.session.commit()

    return redirect(request.referrer)


@todos.route("/delete_todo")
def delete_todo():
    todo_ = Todo.query.get(int(request.args.get("id_")))
    db.session.delete(todo_)
    db.session.commit()

    return redirect(request.referrer)


@todos.route("/mark_todo")
def mark_todo():
    todo_ = Todo.query.get(int(request.args.get("id_")))
    todo_.mark()

    return redirect(request.referrer)


@todos.route("/doing_todo")
def doing_todo():
    todo_ = Todo.query.get(int(request.args.get("id_")))
    if todo_.status == "Doing":
        todo_.status = "Todo"
    else:
        todo_.status = "Doing"

    db.session.commit()

    return redirect(request.referrer)


@todos.route("/commit_todo")
def commit_todo():
    todo_ = Todo.query.get(int(request.args.get("id_")))
    todo_.commit()

    return redirect(request.referrer)


@todos.route("/git_command")
def git_command():
    repo_ = Repo.query.get(int(request.args.get("id_")))

    return repo_.git_command(request.args.get("cmd"))


@todos.route("/export_todos")
def export_todos():
    repo_ = Repo.query.get(int(request.args.get("id_")))
    repo_.export_todos()

    return redirect(request.referrer)
