from flask import Blueprint, redirect, render_template, request

from code_garden import config, generator
from code_garden.models import File, Repository

repositories = Blueprint("repositories", __name__)


@repositories.route("/create_repository", methods=["POST"])
def create_repository():
    repo_ = Repository(config.HOME_DIR / request.form.get("name"))
    repo_.init(request.form.get("brief_descrip"))
    return redirect(request.referrer)


@repositories.route("/get_repository")
def get_repository():
    return Repository(config.HOME_DIR / request.args.get("name")).to_dict()


@repositories.route("/get_readme")
def get_readme():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return repo_.readme


@repositories.route("/get_todos")
def get_todos():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return dict(todos=[i.to_dict() for i in repo_.todos])


@repositories.route("/get_diffs")
def get_diffs():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return dict(diffs=[i.to_dict() for i in repo_.diffs])


@repositories.route("/get_file")
def get_file():
    file_ = File(request.args.get("path"))
    return file_.content


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


@repositories.route("/push")
def push():
    repo_ = Repository(config.HOME_DIR / request.args.get("name"))
    return repo_.push()


@repositories.route("/generate_repo_name")
def generate_repo_name():
    return generator.generate()
