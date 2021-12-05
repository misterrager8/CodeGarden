from dateutil.utils import today
from flask import render_template, redirect, request, current_app

from ProjectManager.ctrla import Database
from ProjectManager.models import Project, Todo

database = Database()


@current_app.route("/")
def projects():
    order_by = request.args.get("order_by", default="start_date desc")
    return render_template("index.html",
                           projects=database.search(Project, order_by=order_by),
                           order_by=order_by)


@current_app.route("/project_create", methods=["POST"])
def project_create():
    database.create(Project(name=request.form["project_name"].title(),
                            start_date=today(),
                            status="Planning"))
    return redirect(request.referrer)


@current_app.route("/project")
def project():
    project_: Project = database.get(Project, request.args.get("id_"))

    return render_template("project.html", project=project_)


@current_app.route("/project_edit", methods=["POST"])
def project_edit():
    project_: Project = database.get(Project, request.form["id_"])

    project_.name = request.form["project_name"]
    project_.descrip = request.form["descrip"]
    project_.status = request.form["status"]
    project_.github_url = request.form["github_url"]
    project_.tools = request.form["tools"]

    database.update()

    return redirect(request.referrer)


@current_app.route("/project_delete")
def project_delete():
    project_: Project = database.get(Project, request.args.get("id_"))
    database.delete(project_)

    return redirect(request.referrer)


@current_app.route("/tools")
def tools():
    return render_template("tools.html")


@current_app.route("/todo_create", methods=["POST"])
def todo_create():
    database.create(Todo(item=request.form["task"].capitalize(),
                         project_id=int(request.form["id_"])))
    database.update()

    return redirect(request.referrer)


@current_app.route("/todo_edit", methods=["POST"])
def todo_edit():
    todo_: Todo = database.get(Todo, request.form["id_"])
    todo_.item = request.form["item"]

    database.update()

    return redirect(request.referrer)


@current_app.route("/todo_mark", methods=["POST"])
def todo_mark():
    todo_: Todo = database.get(Todo, request.form["id_"])
    todo_.done = not todo_.done
    database.update()

    return redirect(request.referrer)


@current_app.route("/todo_delete")
def todo_delete():
    todo: Todo = database.get(Todo, request.args.get("id_"))
    database.delete(todo)

    return redirect(request.referrer)
