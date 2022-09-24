from flask import current_app, redirect, render_template, request

from code_garden.models import Repository


@current_app.context_processor
def get_repositories():
    return dict(repos=Repository.all())


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/repo")
def repo():
    repo_ = Repository(request.args.get("path"))
    return render_template("repo.html", repo_=repo_)


@current_app.route("/checkout")
def checkout():
    repo_ = Repository(request.args.get("path"))
    repo_.checkout(request.args.get("branch"))

    return redirect(request.referrer)


@current_app.route("/commit", methods=["POST"])
def commit():
    repo_ = Repository(request.args.get("path"))
    repo_.commit(f"{request.form['type']}: {request.form['msg']}")

    return redirect(request.referrer)


@current_app.route("/add_todo", methods=["POST"])
def add_todo():
    repo_ = Repository(request.args.get("path"))
    open(repo_.path / "todo.txt", "a").write(f"{request.form['description']}\n")

    return redirect(request.referrer)


@current_app.route("/delete_todo")
def delete_todo():
    repo_ = Repository(request.args.get("path"))
    todos_ = repo_.todos

    todos_.pop(int(request.args.get("idx")))
    repo_.save_todos(todos_)

    return redirect(request.referrer)
