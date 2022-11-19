from flask import Blueprint, redirect, render_template, request

from code_garden import config
from code_garden.models import Repository

repositories = Blueprint("repositories", __name__)


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
    repo_.commit(request.form.get("msg"))

    return redirect(request.referrer)
