from flask import request, current_app, render_template, url_for
from ProjectManager.db_ import Database
from werkzeug.utils import redirect
import datetime
from ProjectManager.models import Project, Todo

from werkzeug.utils import redirect

db = Database()


@current_app.route("/")
def index():
    return render_template("index.html", projects_=Project.query)
