from flask import request, current_app, render_template, url_for
from ProjectManager import login_manager
from ProjectManager.db_ import Database
from werkzeug.utils import redirect
import datetime
from ProjectManager.models import User, Project, Todo

from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import redirect

db = Database()


@login_manager.user_loader
def load_user(id_: int):
    return User.query.get(id_)


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@current_app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    user_: User = User.query.filter(User.username == username).first()
    if user_ and check_password_hash(user_.password, password):
        login_user(user_)
        return redirect(url_for("index"))
    else:
        return "Login failed."


@current_app.route("/signup", methods=["POST"])
def signup():
    username = request.form["username"]
    password = request.form["password"]

    user_ = User(username=username, password=generate_password_hash(password))
    db.create(user_)
    login_user(user_)

    return redirect(url_for("index"))
