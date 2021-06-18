from datetime import date

from sqlalchemy import Column, Text, Integer, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from modules import db


class Project(db.Model):
    __tablename__ = "projects"

    name = Column(Text)
    descrip = Column(Text)
    start_date = Column(Date)
    status = Column(Text)
    github_url = Column(Text)
    tools = Column(Text)
    todos = relationship("Todo", backref="projects")
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Project, self).__init__(**kwargs)

    def __str__(self):
        return "%s,%s,%s,%s,%s" % (self.name,
                                   self.descrip,
                                   self.start_date,
                                   self.status,
                                   self.github_url)


class Todo(db.Model):
    __tablename__ = "todos"

    item = Column(Text)
    date_added = Column(Date, default=date.today())
    done = Column(Boolean, default=False)
    project_id = Column(ForeignKey("projects.id"))
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Todo, self).__init__(**kwargs)

    def __str__(self):
        return "%s,%s,%s,%s" % (self.item,
                                self.date_added,
                                self.done,
                                self.projects.name)


db.create_all()
