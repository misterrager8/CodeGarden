from datetime import date

from flask import render_template, redirect, url_for, request

from modules import app, db
from modules.model import Project, Todo


@app.route("/", methods=["GET", "POST"])
def projects():
    return render_template("index.html", projects=db.session.query(Project))


@app.route("/create", methods=["GET", "POST"])
def create_project():
    project_name: str = request.form["project_name"]
    start_date: date = request.form["start_date"]
    descrip: str = request.form["descrip"]
    status: str = request.form["status"]
    github_url: str = request.form["github_url"]
    tools_: str = request.form["tools"]

    db.session.add(Project(name=project_name.title(),
                           start_date=start_date,
                           descrip=descrip,
                           status=status.title(),
                           github_url=github_url,
                           tools=tools_))
    db.session.commit()

    return redirect(url_for("projects"))


@app.route("/project", methods=["GET", "POST"])
def read_project():
    id_: int = request.args.get("id_")
    project: Project = db.session.query(Project).get(id_)

    return render_template("project.html", project=project)


@app.route("/update", methods=["GET", "POST"])
def update_project():
    id_: int = request.args.get("id_")
    project: Project = db.session.query(Project).get(id_)

    if request.method == "POST":
        project_name: str = request.form["project_name"]
        start_date: date = request.form["start_date"]
        descrip: str = request.form["descrip"]
        status: str = request.form["status"]
        github_url: str = request.form["github_url"]
        tools_: str = request.form["tools"]

        project.name = project_name.title()
        project.start_date = start_date
        project.descrip = descrip
        project.status = status.title()
        project.github_url = github_url
        project.tools = tools_

        db.session.commit()

        return redirect(url_for("projects"))


@app.route("/delete", methods=["GET", "POST"])
def delete_project():
    id_: int = request.args.get("id_")
    project: Project = db.session.query(Project).get(id_)

    db.session.delete(project)
    db.session.commit()

    return redirect(url_for("projects"))


@app.route("/tools")
def tools():
    _ = []
    for i in db.session.query(Project):
        for j in i.tools.split(","):
            _.append(j)

    return render_template("tools.html", x=set(_))


@app.route("/create_todo", methods=["GET", "POST"])
def create_todo():
    id_: int = request.args.get("id_")
    project: Project = db.session.query(Project).get(id_)

    if request.method == "POST":
        task: str = request.form["task"]
        project.todos.append(Todo(item=task.capitalize()))
        db.session.commit()

        return redirect(url_for("read_project", id_=id_))


@app.route("/update_todos", methods=["GET", "POST"])
def update_todos():
    id_: int = request.args.get("id_")
    project: Project = db.session.query(Project).get(id_)

    if request.method == "POST":
        todos = request.form.getlist("done")
        db.session.commit()

        return redirect(url_for("read_project", id_=project.id))


@app.route("/delete_todo", methods=["GET", "POST"])
def delete_todo():
    id_: int = request.args.get("id_")
    todo: Todo = db.session.query(Todo).get(id_)
    _: Project = todo.projects

    db.session.delete(todo)
    db.session.commit()

    return redirect(url_for("read_project", id_=_.id))
