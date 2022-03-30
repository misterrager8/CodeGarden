from flask_login import UserMixin
from sqlalchemy import Column, Integer, Text, DateTime, Date, ForeignKey, Boolean, text
from sqlalchemy.orm import relationship

from ProjectManager import db


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(Text)
    password = Column(Text)
    date_created = Column(DateTime)
    projects = relationship("Project", lazy="dynamic")

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)


class Project(db.Model):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    name = Column(Text)
    readme = Column(Text)
    start_date = Column(Date)
    github_url = Column(Text)
    user = Column(Integer, ForeignKey("users.id"))
    todos = relationship("Todo", lazy="dynamic")

    def __init__(self, **kwargs):
        super(Project, self).__init__(**kwargs)

    def get_todos(self, filter_: str = "", order_by: str = "date_added desc"):
        return self.todos.filter(text(filter_)).order_by("done", text(order_by))


class Todo(db.Model):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True)
    item = Column(Text)
    date_added = Column(DateTime)
    done = Column(Boolean, default=False)
    project = Column(ForeignKey("projects.id"))

    def __init__(self, **kwargs):
        super(Todo, self).__init__(**kwargs)
