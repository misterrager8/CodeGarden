import json

from flask import Blueprint, redirect, render_template, request

from code_garden import config
from code_garden.models import File, Repository

repositories = Blueprint("repositories", __name__)


@repositories.route("/create_repository", methods=["POST"])
def create_repository():
    repo_ = Repository(config.HOME_DIR / request.form.get("name"))
    repo_.init(request.form.get("brief_descrip"))
    return repo_.to_dict()


@repositories.route("/clone_repository", methods=["POST"])
def clone_repository():
    return Repository.clone(request.form.get("url"))


@repositories.route("/delete_repository")
def delete_repository():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    repo_.delete()
    return dict(repos=[i.to_dict() for i in Repository.all()])


@repositories.route("/get_repository")
def get_repository():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    if not (repo_.path / "todos.json").exists():
        with open(repo_.path / "todos.json", "w") as f:
            json.dump(dict(todos=[]), f, indent=4)
    return dict(
        repo=repo_.to_dict(),
        log=[i.to_dict() for i in repo_.log],
        readme=repo_.readme,
        todos=[i.data for i in repo_.todos],
        diffs=[i.to_dict() for i in repo_.diffs],
        branches=repo_.branches,
        ignored=repo_.ignored,
    )


@repositories.post("/edit_readme")
def edit_readme():
    repo_ = Repository(config.HOME_DIR / request.form.get("name"))
    open(repo_.path / "README.md", "w").write(request.form.get("txt"))

    return repo_.readme


@repositories.route("/get_todos")
def get_todos():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return dict(todos=[i.data for i in repo_.todos])


@repositories.route("/get_diffs")
def get_diffs():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return dict(diffs=[i.to_dict() for i in repo_.diffs])


@repositories.route("/get_file")
def get_file():
    file_ = File(request.args.get("path"))
    return file_.content


@repositories.route("/get_ignored")
def get_ignored():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return dict(ignored=repo_.ignored)


@repositories.route("/ignore_file")
def ignore_file():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    file_ = File(request.args.get("path"))

    repo_.ignore(file_.path)
    return ""


@repositories.route("/reset_file")
def reset_file():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    file_ = File(request.args.get("path"))

    repo_.reset(file_.path)
    return ""


@repositories.route("/reset_all")
def reset_all():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    repo_.reset_all()

    return ""


@repositories.route("/get_log")
def get_log():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return dict(log=[i.to_dict() for i in repo_.log])


@repositories.route("/get_branches")
def get_branches():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return dict(branches=repo_.branches)


@repositories.route("/commit", methods=["POST"])
def commit():
    repo_ = Repository(config.HOME_DIR / request.form.get("name"))
    return repo_.commit(request.form.get("msg"))


@repositories.route("/checkout")
def checkout():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    repo_.checkout(request.args.get("branch"))

    return redirect(request.referrer)


@repositories.route("/merge")
def merge():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return repo_.merge(request.args.get("branch"))


@repositories.route("/create_branch", methods=["POST"])
def create_branch():
    repo_ = Repository(config.HOME_DIR / request.form.get("repo"))
    repo_.create_branch(request.form.get("name"))

    return redirect(request.referrer)


@repositories.route("/delete_branch")
def delete_branch():
    repo_ = Repository(config.HOME_DIR / request.args.get("repo"))
    print(repo_.delete_branch(request.args.get("name")))

    return redirect(request.referrer)


@repositories.route("/push")
def push():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return repo_.push()
