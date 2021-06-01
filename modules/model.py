import random
from datetime import datetime, date

from sqlalchemy import Column, Text, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship

from modules import db


class Tool(db.Model):
    __tablename__ = "tools"

    name = Column(Text)
    color = Column(Text)
    projects = relationship("Project", secondary="links")
    id = Column(Integer, primary_key=True)

    def __init__(self,
                 name: str):
        self.name = name
        self.color = "#{:06x}".format(random.randint(0, 0xFFFFFF))

    def __str__(self):
        return "%d\t%s" % (self.id, self.name)


class Link(db.Model):
    __tablename__ = "links"

    project_id = Column(Integer, ForeignKey("projects.id"), primary_key=True)
    tool_id = Column(Integer, ForeignKey("tools.id"), primary_key=True)


class Project(db.Model):
    __tablename__ = "projects"

    name = Column(Text)
    descrip = Column(Text)
    start_date = Column(Date)
    status = Column(Text)
    github_url = Column(Text)
    tools = relationship("Tool", secondary="links")
    id = Column(Integer, primary_key=True)

    def __init__(self,
                 name: str,
                 descrip: str = None,
                 start_date: date = datetime.now().date(),
                 status: str = "In Development",
                 github_url: str = None):
        self.name = name
        self.descrip = descrip
        self.start_date = start_date
        self.status = status
        self.github_url = github_url

    def set_tools(self, tools: list):
        self.tools = tools
        db.session.commit()

    def get_start_date(self, formt: str) -> str:
        return self.start_date.strftime(formt)

    def get_status(self) -> list:
        if self.status == "In Development":
            return [self.status, "#2ab04e"]
        elif self.status == "Paused":
            return [self.status, "#66b9cc"]
        elif self.status == "Released":
            return [self.status, "#0004ff"]
        elif self.status == "Archived":
            return [self.status, "#ff8c00"]

    def get_tools(self) -> str:
        return ",".join([i.name for i in self.tools])

    def __str__(self):
        return "%d\t%s" % (self.id, self.name)


db.create_all()
