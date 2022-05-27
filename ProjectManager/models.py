from sqlalchemy import Column, Text, Integer, DateTime, Boolean, ForeignKey, text
from sqlalchemy.orm import relationship
from ProjectManager import db
from flask_login import UserMixin
import markdown


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(Text)
    password = Column(Text)
    projects = relationship("Project", lazy="dynamic")
    todos = relationship("Todo", lazy="dynamic")

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    def get_projects(self, order_by: str = "id desc", filter_: str = ""):
        return self.projects.filter(text(filter_)).order_by(text(order_by))


class Project(db.Model):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    name = Column(Text)
    tagline = Column(Text)
    readme = Column(Text)
    start_date = Column(DateTime)
    user = Column(Integer, ForeignKey("users.id"))
    todos = relationship("Todo", backref="projects", lazy="dynamic")

    def __init__(self, **kwargs):
        super(Project, self).__init__(**kwargs)

    def format_readme(self):
        return markdown.markdown(self.readme)

    def get_todos(self, order_by: str = "id desc", filter_: str = ""):
        return self.todos.filter(text(filter_)).order_by("done", text(order_by))

    def get_undone_count(self) -> int:
        return self.todos.filter(text("not done")).count()


class Todo(db.Model):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True)
    desc = Column(Text)
    done = Column(Boolean, default=False)
    date_added = Column(DateTime)
    user = Column(Integer, ForeignKey("users.id"))
    project = Column(Integer, ForeignKey("projects.id"))

    def __init__(self, **kwargs):
        super(Todo, self).__init__(**kwargs)
