import markdown
from flask import Blueprint, redirect, render_template, request, url_for

from GitSome import db
from GitSome.models import Repo

repos = Blueprint("repos", __name__)


@repos.route("/suggest_name")
def suggest_name():
    filepath = request.args.get("filepath")
    return filepath.split("/")[-1]


@repos.route("/add_repo", methods=["POST"])
def add_repo():
    name = request.form["name"]
    filepath = request.form["filepath"]

    repo_ = Repo(name=name, filepath=filepath)
    db.session.add(repo_)
    db.session.commit()

    return redirect(url_for("repos.repo", id_=repo_.id))


@repos.route("/repo")
def repo():
    repo_ = Repo.query.get(int(request.args.get("id_")))

    return render_template("repo.html", repo_=repo_)


@repos.route("/save_readme", methods=["POST"])
def save_readme():
    repo_ = Repo.query.get(int(request.form["id_"]))
    with open("%s/README.md" % repo_.filepath, "w") as f:
        f.write(request.form["readme"])

    return redirect(request.referrer)


@repos.route("/preview_readme")
def preview_readme():
    return markdown.markdown(request.args.get("readme"))


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
