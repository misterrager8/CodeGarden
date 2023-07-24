from flask import current_app, render_template, request

from .. import config
from ..models import Branch, DiffItem, IgnoreItem, Repository, Todo


@current_app.get("/")
def index():
    return render_template("index.html", env=current_app.config["ENV"])


@current_app.post("/settings")
def settings():
    return dict(home_dir=str(config.HOME_DIR))


@current_app.post("/repositories")
def repositories():
    return dict(repositories_=[i.to_dict() for i in Repository.all()])


@current_app.post("/commit")
def commit():
    repository_ = Repository(request.json.get("name"))
    repository_.commit(request.json.get("msg"))

    return {"status": "done"}


@current_app.post("/create_repository")
def create_repository():
    repository_ = Repository(request.json.get("name"))
    repository_.init(request.json.get("brief_descrip"))
    return repository_.to_dict()


@current_app.post("/generate_name")
def generate_name():
    return {"name": Repository.generate_name()}


@current_app.post("/repository")
def repository():
    repository_ = Repository(request.json.get("name"))
    return repository_.to_dict()


@current_app.post("/delete_repository")
def delete_repository():
    repository_ = Repository(request.json.get("name"))
    repository_.delete()
    return {"status": "done"}


@current_app.post("/export_repository")
def export_repository():
    repository_ = Repository(request.json.get("name"))
    repository_.export()
    return {"status": "done"}


@current_app.post("/clone_repository")
def clone_repository():
    Repository.clone(request.json.get("url"))

    return {"status": "done"}


@current_app.post("/edit_readme")
def edit_readme():
    repository_ = Repository(request.json.get("name"))
    repository_.edit_readme(request.json.get("content"))
    return {"status": "done"}


@current_app.post("/create_branch")
def create_branch():
    branch_ = Branch(request.json.get("repository"), request.json.get("name"))
    branch_.create()

    return {"status": "done"}


@current_app.post("/delete_branch")
def delete_branch():
    branch_ = Branch(request.json.get("repository"), request.json.get("name"))
    branch_.delete()

    return {"status": "done"}


@current_app.post("/checkout_branch")
def checkout_branch():
    branch_ = Branch(request.json.get("repository"), request.json.get("name"))
    branch_.checkout()

    return {"status": "done"}


@current_app.post("/merge_branch")
def merge_branch():
    branch_ = Branch(request.json.get("repository"), request.json.get("name"))
    branch_.merge(request.json.get("other_branch"))

    return {"status": "done"}


@current_app.post("/create_todo")
def create_todo():
    todo_ = Todo(request.json.get("repository"), request.json.get("name"))
    todo_.create()

    return {"status": "done"}


@current_app.post("/edit_todo")
def edit_todo():
    Todo.edit(
        request.json.get("repository"),
        int(request.json.get("id")),
        request.json.get("new_name"),
    )

    return {"status": "done"}


@current_app.post("/delete_todo")
def delete_todo():
    Todo.delete(request.json.get("repository"), int(request.json.get("id")))

    return {"status": "done"}


@current_app.post("/toggle_todo")
def toggle_todo():
    Todo.toggle(request.json.get("repository"), int(request.json.get("id")))

    return {"status": "done"}


@current_app.post("/create_ignore")
def create_ignore():
    ignore_ = IgnoreItem(request.json.get("repository"), request.json.get("name"))
    ignore_.create()

    return {"status": "done"}


@current_app.post("/delete_ignore")
def delete_ignore():
    IgnoreItem.delete(request.json.get("repository"), int(request.json.get("id")))

    return {"status": "done"}


@current_app.post("/reset_file")
def reset_file():
    diff_ = DiffItem(request.json.get("repository"), request.json.get("name"))
    diff_.reset()

    return {"status": "done"}


@current_app.post("/reset_all")
def reset_all():
    repo_ = Repository(request.json.get("name"))
    repo_.reset_all()

    return {"status": "done"}


@current_app.post("/push")
def push():
    repo_ = Repository(request.json.get("name"))
    repo_.push()

    return {"status": "done"}


@current_app.post("/run_command")
def run_command():
    Repository(request.json.get("repository")).run_command(
        request.json.get("cmd").split()
    )

    return {"status": "done"}
