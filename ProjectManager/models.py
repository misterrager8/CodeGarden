from sqlalchemy import Column, Text, Integer, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from ProjectManager import db


class Project(db.Model):
    __tablename__ = "projects"

    name = Column(Text)
    descrip = Column(Text)
    start_date = Column(Date)
    status = Column(Text)
    github_url = Column(Text)
    tools = Column(Text)
    todos = relationship("Todo", backref="projects", lazy="dynamic")
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Project, self).__init__(**kwargs)

    def get_undone_todos(self) -> int:
        count = 0
        for i in self.todos:
            if not i.done:
                count += 1

        return count

    def get_status(self):
        if self.status == "Active":
            return [self.status, "green"]
        elif self.status == "Released (Archived)":
            return [self.status, "#1d5e8a"]
        elif self.status == "Released (Maintained)":
            return [self.status, "#723cc2"]
        elif self.status == "Planning":
            return [self.status, "#db7d12"]
        elif self.status == "Paused":
            return [self.status, "gray"]


class Todo(db.Model):
    __tablename__ = "todos"

    item = Column(Text)
    date_added = Column(Date)
    done = Column(Boolean, default=False)
    project_id = Column(ForeignKey("projects.id"))
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Todo, self).__init__(**kwargs)


class Tool(db.Model):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Tool, self).__init__(**kwargs)


db.create_all()
