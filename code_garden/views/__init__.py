from flask import current_app, redirect, render_template, request

from code_garden.models import Repository


@current_app.context_processor
def get_repositories():
    return dict(repos=Repository.all())


@current_app.route("/")
def index():
    return render_template("index.html")
