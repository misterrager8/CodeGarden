from flask import current_app, render_template

from code_garden import config
from code_garden.models import Repository


@current_app.route("/get_repos")
def get_repos():
    return dict(repos=[i.to_dict() for i in Repository.all()])


@current_app.context_processor
def get_env():
    return dict(env=current_app.config["ENV"])


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/settings")
def settings():
    return config.settings_dict
