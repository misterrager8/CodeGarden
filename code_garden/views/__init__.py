from flask import current_app, render_template

from code_garden.models import Repo


@current_app.context_processor
def get_repos():
    return dict(repos=Repo.all())


@current_app.route("/")
def index():
    return render_template("index.html")
