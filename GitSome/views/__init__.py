import markdown
from flask import current_app, render_template

from GitSome import db
from GitSome.models import Repo


@current_app.context_processor
def get_repos():
    return {"repos": Repo.query.order_by(db.text("pinned desc"))}


@current_app.route("/")
def index():
    return render_template("index.html")
