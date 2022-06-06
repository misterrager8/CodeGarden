from ProjectManager import db
from os.path import exists
import subprocess


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    filepath = db.Column(db.Text)
    todos = db.relationship("Todo", lazy="dynamic", backref="projects")

    def __init__(self, **kwargs):
        super(Project, self).__init__(**kwargs)

    def get_todos(self, filter_: str = "", order_by: str = ""):
        return self.todos.filter(db.text(filter_)).order_by(
            Todo.done, db.text(order_by)
        )

    def export_todos(self):
        with open("%s/todo.txt" % self.filepath, "w") as f:
            for i in self.todos:
                if i.done:
                    f.write("- [x] %s\n" % i.task)
                else:
                    f.write("- [ ] %s\n" % i.task)

    def get_readme(self):
        if exists("%s/README.md" % self.filepath):
            with open("%s/README.md" % self.filepath) as f:
                r = f.read()
            return r
        else:
            return ""


class Todo(db.Model):
    __tablename__ = "todos"

    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.Text)
    done = db.Column(db.Boolean)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))

    def __init__(self, **kwargs):
        super(Todo, self).__init__(**kwargs)

    def mark(self):
        self.done = not self.done
        db.session.commit()

    def commit(self):
        subprocess.run(["git", "commit", "-am", self.task], cwd=self.projects.filepath)
        self.done = not self.done
        db.session.commit()
