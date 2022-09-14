from pathlib import Path

from flask import Blueprint, redirect, render_template, request, url_for

from code_garden import config
from code_garden.models import Repo

HOME_DIR = Path(config.HOME_DIR)


repos = Blueprint("repos", __name__)


@repos.route("/repo")
def repo():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    return render_template("repo.html", repo_=repo_)


@repos.route("/create_repo", methods=["POST"])
def create_repo():
    repo_ = Repo(HOME_DIR / request.form["name"])
    repo_.create(request.form["description"])

    return redirect(url_for("repos.repo", name=repo_.name))


@repos.route("/create_branch", methods=["POST"])
def create_branch():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    repo_.git(["git", "branch", request.form["branch"]])
    repo_.git(["git", "checkout", request.form["branch"]])

    return redirect(request.referrer)


@repos.route("/checkout")
def checkout():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    repo_.git(["git", "checkout", request.args.get("branch")])

    return redirect(request.referrer)


@repos.route("/commit", methods=["POST"])
def commit():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    repo_.git(["git", "add", "-A"])
    repo_.git(["git", "commit", "-m", request.form["msg"]])

    return redirect(request.referrer)


@repos.route("/delete_repo")
def delete_repo():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    repo_.delete()

    return redirect(url_for("index"))
