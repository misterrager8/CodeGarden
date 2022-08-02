from flask import render_template, current_app, redirect, request, url_for
from GitSome.models import Project, Todo
from GitSome import db
import markdown


@current_app.context_processor
def get_projects():
    return {"projects": Project.query.order_by(db.text("pinned desc"))}


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/suggest_name")
def suggest_name():
    filepath = request.args.get("filepath")
    return filepath.split("/")[-1]


@current_app.route("/add_project", methods=["POST"])
def add_project():
    name = request.form["name"]
    filepath = request.form["filepath"]

    project_ = Project(name=name, filepath=filepath)
    db.session.add(project_)
    db.session.commit()

    return redirect(url_for("project", id_=project_.id))


@current_app.route("/project")
def project():
    project_ = Project.query.get(int(request.args.get("id_")))

    return render_template("project.html", project_=project_)


@current_app.route("/save_readme", methods=["POST"])
def save_readme():
    project_ = Project.query.get(int(request.form["id_"]))
    with open("%s/README.md" % project_.filepath, "w") as f:
        f.write(request.form["readme"])

    return redirect(request.referrer)


@current_app.route("/preview_readme")
def preview_readme():
    return markdown.markdown(request.args.get("readme"))


@current_app.route("/delete_project")
def delete_project():
    project_ = Project.query.get(int(request.args.get("id_")))
    db.session.delete(project_)
    db.session.commit()

    return redirect(url_for("index"))


@current_app.route("/pin_project")
def pin_project():
    project_ = Project.query.get(int(request.args.get("id_")))
    project_.pinned = not project_.pinned
    db.session.commit()

    return redirect(request.referrer)


@current_app.route("/add_todo", methods=["POST"])
def add_todo():
    project_id = int(request.form["id_"])
    task = request.form["task"]

    todo_ = Todo(task=task, project_id=project_id)
    db.session.add(todo_)
    db.session.commit()

    return redirect(request.referrer)


@current_app.route("/edit_todo", methods=["POST"])
def edit_todo():
    todo_ = Todo.query.get(int(request.form["id_"]))
    todo_.task = request.form["task"]
    todo_.note = request.form["note"]

    db.session.commit()

    return redirect(request.referrer)


@current_app.route("/delete_todo")
def delete_todo():
    todo_ = Todo.query.get(int(request.args.get("id_")))
    db.session.delete(todo_)
    db.session.commit()

    return redirect(request.referrer)


@current_app.route("/mark_todo")
def mark_todo():
    todo_ = Todo.query.get(int(request.args.get("id_")))
    todo_.mark()

    return redirect(request.referrer)


@current_app.route("/doing_todo")
def doing_todo():
    todo_ = Todo.query.get(int(request.args.get("id_")))
    if todo_.status == "Doing":
        todo_.status = "Todo"
    else:
        todo_.status = "Doing"

    db.session.commit()

    return redirect(request.referrer)


@current_app.route("/commit_todo")
def commit_todo():
    todo_ = Todo.query.get(int(request.args.get("id_")))
    todo_.commit()

    return redirect(request.referrer)


@current_app.route("/git_command")
def git_command():
    project_ = Project.query.get(int(request.args.get("id_")))

    return project_.git_command(request.args.get("cmd"))


@current_app.route("/export_todos")
def export_todos():
    project_ = Project.query.get(int(request.args.get("id_")))
    project_.export_todos()

    return redirect(request.referrer)
