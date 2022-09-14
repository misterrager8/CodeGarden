from pathlib import Path

from flask import Blueprint, redirect, render_template, request

from code_garden import config
from code_garden.models import Repo

HOME_DIR = Path(config.HOME_DIR)


repos = Blueprint("repos", __name__)


@repos.route("/repo")
def repo():
    repo_ = Repo(HOME_DIR / request.args.get("name"))
    return render_template("repo.html", repo_=repo_)


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
