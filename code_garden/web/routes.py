import datetime
from pathlib import Path

import click
from flask import current_app, render_template, request, send_from_directory

from code_garden.todos import Todo

from .. import config
from ..models import Branch, DiffItem, IgnoreItem, LogItem, Repository


@current_app.get("/")
def index():
    return send_from_directory(current_app.static_folder, "index.html")


@current_app.post("/about")
def about():
    success = True
    msg = ""
    readme_ = ""

    try:
        readme_ = open(Path(__file__).parent.parent.parent / "README.md").read()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "readme": readme_,
    }


@current_app.post("/settings")
def settings():
    return config.get()


@current_app.post("/repositories")
def repositories():
    return dict(repositories_=[i.to_dict() for i in Repository.all()])


@current_app.post("/commit")
def commit():
    repository_ = Repository(request.json.get("name"))
    repository_.commit(request.json.get("msg"))

    return {
        "status": "done",
        "repo": repository_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/get_commit")
def get_commit():
    return {
        "details": LogItem.get(
            request.json.get("name"), request.json.get("abbrev_hash")
        )
    }


@current_app.post("/create_repository")
def create_repository():
    repository_ = Repository(request.json.get("name"))
    repository_.init("")

    return repository_.to_dict()


@current_app.post("/generate_name")
def generate_name():
    return {"name": Repository.generate_name()}


@current_app.post("/repository")
def repository():
    try:
        repository_ = Repository(request.json.get("name"))
        return repository_.to_dict()
    except:
        return "none"


@current_app.post("/delete_repository")
def delete_repository():
    repository_ = Repository(request.json.get("name"))
    repository_.delete()
    return {"status": "done", "repos": [i.to_dict() for i in Repository.all()]}


@current_app.post("/export_repository")
def export_repository():
    repository_ = Repository(request.json.get("name"))
    repository_.export()
    return {
        "status": "done",
        # "repo": repository_.to_dict(),
        # "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/clone_repository")
def clone_repository():
    Repository.clone(request.json.get("url"))

    return {"status": "done"}


@current_app.post("/git_config")
def git_config():
    return {"config": Repository.config()}


@current_app.post("/edit_readme")
def edit_readme():
    repository_ = Repository(request.json.get("name"))
    repository_.edit_readme(request.json.get("content"))
    return {
        "status": "done",
        "repo": repository_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/create_branch")
def create_branch():
    branch_ = Branch(request.json.get("repository"), request.json.get("name"))
    branch_.create()

    repo_ = Repository(request.json.get("repository"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/delete_branch")
def delete_branch():
    branch_ = Branch(request.json.get("repository"), request.json.get("name"))
    branch_.delete()

    repo_ = Repository(request.json.get("repository"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/compare_branches")
def compare_branches():
    repo_ = Repository(request.json.get("repository"))
    comparison = repo_.compare_branches(
        request.json.get("baseBranch"), request.json.get("childBranch")
    )

    return {"status": "done", "comparison": comparison}


@current_app.post("/checkout_branch")
def checkout_branch():
    branch_ = Branch(request.json.get("repository"), request.json.get("name"))
    branch_.checkout()

    repo_ = Repository(request.json.get("repository"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/push_stash")
def push_stash():
    repo_ = Repository(request.json.get("repository"))
    repo_.stash(request.json.get("name"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/unstash")
def unstash():
    repo_ = Repository(request.json.get("repository"))
    repo_.unstash(int(request.json.get("id")))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/drop_stash")
def drop_stash():
    repo_ = Repository(request.json.get("repository"))
    repo_.drop_stash(int(request.json.get("id")))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/merge_branch")
def merge_branch():
    repo_ = Repository(request.json.get("repository"))
    repo_.merge(
        request.json.get("parentBranch"),
        request.json.get("childBranch"),
        request.json.get("msg"),
        request.json.get("deleteHead"),
    )

    return {"status": "done", "repo": repo_.to_dict()}


@current_app.post("/create_todo")
def create_todo():
    todo_ = Todo(
        request.json.get("name"),
        "",
        request.json.get("tag"),
        datetime.datetime.now(),
        "open",
        request.json.get("repository"),
    )
    todo_.add()
    repo_ = Repository(request.json.get("repository"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/edit_todo")
def edit_todo():
    todo_ = Todo.get(request.json.get("id"))

    todo_.title = request.json.get("new_name")
    todo_.tag = request.json.get("new_tag")
    todo_.status = request.json.get("new_status")
    todo_.description = request.json.get("new_desc")
    todo_.edit()

    repo_ = Repository(request.json.get("repository"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/delete_todo")
def delete_todo():
    todo_ = Todo.get(request.json.get("id"))
    todo_.delete()
    repo_ = Repository(request.json.get("repository"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/clear_completed")
def clear_completed():
    repo_ = Repository(request.json.get("repo"))
    for i in repo_.todos:
        if i.status == "completed":
            i.delete()

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/toggle_todo")
def toggle_todo():
    todo_ = Todo.get(request.json.get("id"))

    todo_.status = "completed" if todo_.status in ["open", "active"] else "open"
    todo_.edit()

    repo_ = Repository(request.json.get("repository"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/export_todos")
def export_todos():
    Repository(request.json.get("name")).export_todos()

    return {"status": "done"}


@current_app.post("/import_todos")
def import_todos():
    Repository(request.json.get("name")).import_todos()

    return {"status": "done"}


@current_app.post("/commit_todo")
def commit_todo():
    todo_ = Todo.get(request.json.get("id"))
    repo_ = Repository(todo_.repo)

    todo_.status = "completed" if todo_.status in ["open", "active"] else "open"
    todo_.edit()
    repo_.commit(
        f"({todo_.tag or datetime.date.today().strftime('%d/%m/%Y')}) {todo_.title}"
    )
    repos = [i.to_dict() for i in Repository.all()]

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": repos,
    }


@current_app.post("/create_ignore")
def create_ignore():
    ignore_ = IgnoreItem(request.json.get("repository"), request.json.get("name"))
    ignore_.create()

    repo_ = Repository(request.json.get("repository"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/delete_ignore")
def delete_ignore():
    IgnoreItem.delete(request.json.get("repository"), int(request.json.get("id")))

    repo_ = Repository(request.json.get("repository"))

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/reset_file")
def reset_file():
    repo_ = Repository(request.json.get("repository"))
    diff_ = DiffItem(repo_.name, repo_.path / request.json.get("path"), "")
    diff_.reset()

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/toggle_stage")
def toggle_stage():
    repo_ = Repository(request.json.get("repository"))
    diff_ = DiffItem(
        repo_.name,
        repo_.path / request.json.get("path"),
        request.json.get("type_"),
        request.json.get("staged"),
    )
    diff_.toggle_stage()

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/get_diff")
def get_diff():
    repo_ = Repository(request.json.get("repository"))
    diff_ = DiffItem(repo_.name, request.json.get("path"), "")

    return {
        "details": diff_.get_diff(),
    }


@current_app.post("/reset_all")
def reset_all():
    repo_ = Repository(request.json.get("name"))
    repo_.reset_all()

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/unstage_all")
def unstage_all():
    repo_ = Repository(request.json.get("name"))
    repo_.unstage_all()

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/stage_all")
def stage_all():
    repo_ = Repository(request.json.get("name"))
    repo_.stage_all()

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }


@current_app.post("/push")
def push():
    repo_ = Repository(request.json.get("name"))
    output = repo_.push()
    click.secho(output, fg="blue")

    return {"status": "done", "output": output}


@current_app.post("/pull")
def pull():
    repo_ = Repository(request.json.get("name"))
    output = repo_.pull()

    return {"status": "done", "output": output}


@current_app.post("/run_command")
def run_command():
    repo_ = Repository(request.json.get("repository"))
    repo_.run_command(request.json.get("cmd").split())

    return {
        "status": "done",
        "repo": repo_.to_dict(),
        "repos": [i.to_dict() for i in Repository.all()],
    }
