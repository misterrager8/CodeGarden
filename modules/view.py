from flask import render_template, redirect, url_for, request

from modules import app, db
from modules.model import Tool, Project


@app.route("/", methods=["GET", "POST"])
def projects():
    projects_ = db.session.query(Project).all()
    tools_ = db.session.query(Tool).all()
    return render_template("index.html", projects=projects_, tools=tools_)


@app.route("/project", methods=["GET", "POST"])
def project():
    id_: int = request.args.get("id_")
    _: Project = db.session.query(Project).get(int(id_))
    return render_template("project.html", project_=_)


@app.route("/add_project", methods=["POST"])
def add_project():
    name = request.form["name"]
    descrip = request.form["descrip"]
    tools_used = []
    for i in request.form.getlist("tools_used"):
        x: Tool = db.session.query(Tool).get(int(i))
        tools_used.append(x)

    _ = Project(name, descrip)
    _.add_tools(tools_used)
    db.session.add(_)
    db.session.commit()

    return redirect(url_for("projects"))


@app.route("/edit_project", methods=["POST"])
def edit_project():
    id_: int = request.args.get("id_")
    _: Project = db.session.query(Project).get(int(id_))

    name = request.form["name"]
    descrip = request.form["descrip"]
    tools_used = []
    for i in request.form.getlist("tools_used"):
        x: Tool = db.session.query(Tool).get(int(i))
        tools_used.append(x)

    _.name = name
    _.descrip = descrip
    _.add_tools(tools_used)
    db.session.commit()

    return redirect(url_for("projects"))


@app.route("/tools", methods=["GET", "POST"])
def tools():
    tools_ = db.session.query(Tool).all()
    return render_template("tools.html", tools_=tools_)


@app.route("/tool", methods=["GET", "POST"])
def tool():
    id_: int = request.args.get("id_")
    _: Tool = db.session.query(Tool).get(int(id_))

    return render_template("tool.html", tool_=_)


@app.route("/add_tool", methods=["POST"])
def add_tool():
    name = request.form["name"]

    _ = Tool(name)
    db.session.add(_)
    db.session.commit()

    return redirect(url_for("tools"))
