from sqlalchemy import Column, Text, Integer, DateTime, Boolean, ForeignKey, text
from sqlalchemy.orm import relationship
from ProjectManager import db
import markdown


class Project(db.Model):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    name = Column(Text)
    tagline = Column(Text)
    readme = Column(Text)
    start_date = Column(DateTime)
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
    project = Column(Integer, ForeignKey("projects.id"))

    def __init__(self, **kwargs):
        super(Todo, self).__init__(**kwargs)
