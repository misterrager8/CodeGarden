from pathlib import Path

from flask import Blueprint, redirect, render_template, request, url_for

from code_garden import config
from code_garden.models import Repository

repos = Blueprint("repos", __name__)


@repos.route("/repo")
def repo():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return render_template("repo.html", repo_=repo_)


@repos.route("/init_repo", methods=["POST"])
def init_repo():
    Repository.init(request.form["name"], request.form["desc"])

    return redirect(url_for("repos.repo", name=request.form["name"]))


@repos.route("/checkout")
def checkout():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    repo_.checkout(request.args.get("branch"))

    return redirect(request.referrer)


@repos.route("/commit", methods=["POST"])
def commit():
    repo_ = Repository(config.HOME_DIR / request.form["name"])
    repo_.commit(f"{request.form['type']}: {request.form['msg']}")

    return redirect(request.referrer)


@repos.route("/show_diff")
def show_diff():
    repo_ = Repository(config.HOME_DIR / request.args.get("repo_path"))

    return repo_.cmd(["diff", request.args.get("file_path").strip()])


@repos.route("/ignore")
def ignore():
    repo_ = Repository(config.HOME_DIR / request.args.get("repo_path"))
    file_ = repo_.status[int(request.args.get("idx"))]

    file_.ignore(repo_)

    return redirect(request.referrer)


@repos.route("/unignore")
def unignore():
    repo_ = Repository(config.HOME_DIR / request.args.get("repo_path"))
    ignores = repo_.ignored
    ignores.pop(int(request.args.get("idx")))

    repo_.set_ignored(ignores)

    return redirect(request.referrer)


@repos.route("/reset")
def reset():
    repo_ = Repository(config.HOME_DIR / request.args.get("repo_path"))
    file_ = repo_.status[int(request.args.get("idx"))]

    file_.reset(repo_)

    return redirect(request.referrer)


@repos.route("/create_branch", methods=["POST"])
def create_branch():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    repo_.create_branch(request.form["branch_name"])

    return redirect(request.referrer)
