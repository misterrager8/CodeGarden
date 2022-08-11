from flask import Blueprint, redirect, render_template, request, url_for
from pathlib import Path

from GitSome import db
from GitSome.models import Repo

repos = Blueprint("repos", __name__)


@repos.route("/import_repo", methods=["POST"])
def import_repo():
    filepath = Path(request.form["filepath"])

    repo_ = Repo(name=filepath.name, filepath=filepath)
    db.session.add(repo_)
    db.session.commit()

    return redirect(url_for("repos.repo", id_=repo_.id))


@repos.route("/make_new_repo", methods=["POST"])
def make_new_repo():
    filepath = Path(request.form["filepath"]) / request.form["name"]
    filepath.mkdir()

    repo_ = Repo(name=filepath.name, filepath=filepath)
    db.session.add(repo_)
    db.session.commit()

    repo_.git_command("git init")

    return redirect(url_for("repos.repo", id_=repo_.id))


@repos.route("/repo")
def repo():
    repo_ = Repo.query.get(int(request.args.get("id_")))

    return render_template("repo.html", repo_=repo_)


@repos.route("/save_readme", methods=["POST"])
def save_readme():
    repo_ = Repo.query.get(int(request.args.get("id_")))
    with open("%s/README.md" % repo_.filepath, "w") as f:
        f.write(request.form["readme"])

    return redirect(request.referrer)


@repos.route("/delete_repo")
def delete_repo():
    repo_ = Repo.query.get(int(request.args.get("id_")))
    db.session.delete(repo_)
    db.session.commit()

    return redirect(url_for("index"))


@repos.route("/pin_repo")
def pin_repo():
    repo_ = Repo.query.get(int(request.args.get("id_")))
    repo_.pinned = not repo_.pinned
    db.session.commit()

    return redirect(request.referrer)
