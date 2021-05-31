from flask import render_template, redirect, url_for, request
from sqlalchemy import text

from modules import app, db
from modules.model import Tool, Project


@app.route("/", methods=["GET", "POST"])
def projects():
    order_by = request.args.get("order_by", default="start_date desc")
    return render_template("index.html",
                           projects=db.session.query(Project).order_by(text(order_by)).all(),
                           tools=db.session.query(Tool).all())


@app.route("/add_project", methods=["POST"])
def add_project():
    _ = Project(request.form["name"], request.form["descrip"], status=request.form["status"])
    _.set_tools([db.session.query(Tool).get(int(i)) for i in request.form.getlist("tools_used")])
    db.session.add(_)
    db.session.commit()

    return redirect(url_for("projects"))


@app.route("/edit_project", methods=["POST"])
def edit_project():
    id_: int = request.args.get("id_")
    _: Project = db.session.query(Project).get(int(id_))

    props = {"name": request.form["name"],
             "descrip": request.form["descrip"],
             "status": request.form["status"]}

    for key, value in props.items(): setattr(_, key, value)
    _.set_tools([db.session.query(Tool).get(int(i)) for i in request.form.getlist("tools_used")])
    db.session.commit()

    return redirect(url_for("projects"))


@app.route("/delete")
def delete_project():
    id_: int = request.args.get("id_")
    _: Project = db.session.query(Project).get(int(id_))

    db.session.delete(_)
    db.session.commit()

    return redirect(url_for("projects"))


@app.route("/tools", methods=["GET", "POST"])
def tools():
    return render_template("tools.html", tools_=db.session.query(Tool).all())


@app.route("/tool", methods=["GET", "POST"])
def tool():
    id_: int = request.args.get("id_")
    _: Tool = db.session.query(Tool).get(int(id_))

    return render_template("tool.html", tool_=_)


@app.route("/add_tool", methods=["POST"])
def add_tool():
    db.session.add(Tool(request.form["name"]))
    db.session.commit()

    return redirect(url_for("tools"))
