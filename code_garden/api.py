from flask import current_app, render_template, request

from . import config
from .models import Branch, DiffItem, IgnoreItem, Repository, Todo


@current_app.get("/")
def index():
    return render_template("index.html", env=current_app.config["ENV"])


@current_app.get("/settings")
def settings():
    return dict(home_dir=str(config.HOME_DIR))


@current_app.get("/repositories")
def repositories():
    return dict(repositories_=[i.to_dict() for i in Repository.all()])


@current_app.post("/commit")
def commit():
    repository_ = Repository(request.form.get("name"))
    repository_.commit(request.form.get("msg"))

    return ""


@current_app.post("/create_repository")
def create_repository():
    repository_ = Repository(request.form.get("name"))
    repository_.init(request.form.get("brief_descrip"))
    return repository_.to_dict()


@current_app.get("/repository")
def repository():
    repository_ = Repository(request.args.get("name"))
    return repository_.to_dict()


@current_app.get("/delete_repository")
def delete_repository():
    repository_ = Repository(request.args.get("name"))
    repository_.delete()
    return ""


@current_app.get("/export_repository")
def export_repository():
    repository_ = Repository(request.args.get("name"))
    repository_.export()
    return ""


@current_app.post("/clone_repository")
def clone_repository():
    Repository.clone(request.form.get("url"))

    return ""


@current_app.post("/edit_readme")
def edit_readme():
    repository_ = Repository(request.form.get("name"))
    repository_.edit_readme(request.form.get("content"))
    return ""


@current_app.post("/create_branch")
def create_branch():
    branch_ = Branch(request.form.get("repository"), request.form.get("name"))
    branch_.create()

    return ""


@current_app.get("/delete_branch")
def delete_branch():
    branch_ = Branch(request.args.get("repository"), request.args.get("name"))
    branch_.delete()

    return ""


@current_app.get("/checkout_branch")
def checkout_branch():
    branch_ = Branch(request.args.get("repository"), request.args.get("name"))
    branch_.checkout()

    return ""


@current_app.get("/merge_branch")
def merge_branch():
    branch_ = Branch(request.args.get("repository"), request.args.get("name"))
    branch_.merge(request.args.get("other_branch"))

    return ""


@current_app.post("/create_todo")
def create_todo():
    todo_ = Todo(request.form.get("repository"), request.form.get("name"))
    todo_.create()

    return ""


@current_app.post("/edit_todo")
def edit_todo():
    Todo.edit(
        request.form.get("repository"),
        int(request.form.get("id")),
        request.form.get("new_name"),
    )

    return ""


@current_app.get("/delete_todo")
def delete_todo():
    Todo.delete(request.args.get("repository"), int(request.args.get("id")))

    return ""


@current_app.get("/toggle_todo")
def toggle_todo():
    Todo.toggle(request.args.get("repository"), int(request.args.get("id")))

    return ""


@current_app.post("/create_ignore")
def create_ignore():
    ignore_ = IgnoreItem(request.form.get("repository"), request.form.get("name"))
    ignore_.create()

    return ""


@current_app.get("/delete_ignore")
def delete_ignore():
    IgnoreItem.delete(request.args.get("repository"), int(request.args.get("id")))

    return ""


@current_app.get("/reset_file")
def reset_file():
    diff_ = DiffItem(request.args.get("repository"), request.args.get("name"))
    diff_.reset()

    return ""


@current_app.get("/reset_all")
def reset_all():
    repo_ = Repository(request.args.get("name"))
    repo_.reset_all()

    return ""


@current_app.get("/push")
def push():
    repo_ = Repository(request.args.get("name"))
    repo_.push()

    return ""


@current_app.post("/run_command")
def run_command():
    Repository(request.form.get("repository")).run_command(
        request.form.get("cmd").split()
    )

    return ""
