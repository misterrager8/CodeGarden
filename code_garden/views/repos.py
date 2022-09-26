from flask import Blueprint, redirect, render_template, request

from code_garden.models import Repository

repos = Blueprint("repos", __name__)


@repos.route("/repo")
def repo():
    repo_ = Repository(request.args.get("path"))
    return render_template("repo.html", repo_=repo_)


@repos.route("/checkout")
def checkout():
    repo_ = Repository(request.args.get("path"))
    repo_.checkout(request.args.get("branch"))

    return redirect(request.referrer)


@repos.route("/commit", methods=["POST"])
def commit():
    repo_ = Repository(request.args.get("path"))
    repo_.commit(f"{request.form['type']}: {request.form['msg']}")

    return redirect(request.referrer)