from flask import request, current_app, render_template, url_for, Blueprint
from ProjectManager.db_ import Database
from werkzeug.utils import redirect
import datetime
from ProjectManager.models import Project, Todo
from ProjectManager.readme import Readme

from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import redirect

db = Database()

projects = Blueprint("projects", __name__)


@projects.route("/add_project", methods=["POST"])
def add_project():
    project_ = Project(name=request.form["name"], tagline=request.form["tagline"])
    db.create(project_)
    return redirect(request.referrer)


@projects.route("/make_readme", methods=["POST"])
def make_readme():
    project_: Project = db.get(Project, int(request.form["id_"]))
    features = request.form["features"]
    usage = request.form["usage"]
    contrib = request.form["contrib"]
    tags = request.form["tags"]

    project_.readme = Readme(
        project_.name,
        project_.tagline,
        features=[features],
        usage=usage,
        contrib=contrib,
        tags=[tags],
    ).to_string()
    db.update()
    return redirect(request.referrer)


@projects.route("/project_")
def project_():
    project_: Project = db.get(Project, int(request.args.get("id_")))
    return render_template("project.html", project_=project_)


@projects.route("/edit_project", methods=["POST"])
def edit_project():
    project_: Project = db.get(Project, int(request.form["id_"]))
    project_.name = request.form["name"]
    project_.tagline = request.form["tagline"]
    project_.readme = request.form["readme"]
    db.update()
    return redirect(request.referrer)


@projects.route("/delete_project")
def delete_project():
    project_: Project = db.get(Project, int(request.args.get("id_")))
    db.delete_multiple([i for i in project_.todos])
    db.delete(project_)
    return redirect(request.referrer)
