from sqlalchemy import Column, Text, Integer, Date, ForeignKey, Boolean, text
from sqlalchemy.orm import relationship

from ProjectManager import db

ProjectTool = db.Table('ProjectTool',
                       Column('id', Integer, primary_key=True),
                       Column('project', Integer, ForeignKey('projects.id')),
                       Column('tool', Integer, ForeignKey('tools.id')))


class Project(db.Model):
    __tablename__ = "projects"

    name = Column(Text)
    readme = Column(Text)
    start_date = Column(Date)
    status = Column(Text)
    github_url = Column(Text)
    tools = relationship("Tool", lazy="dynamic", secondary=ProjectTool)
    todos = relationship("Todo", lazy="dynamic")
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Project, self).__init__(**kwargs)

    def get_todos(self, filter_: str = "", order_by: str = "date_added desc"):
        return self.todos.filter(text(filter_)).order_by(text(order_by))


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

    name = Column(Text)
    color = Column(Text)
    projects = relationship("Project", lazy="dynamic", secondary=ProjectTool)
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Tool, self).__init__(**kwargs)
