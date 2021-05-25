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
    tools = relationship("Tool", secondary="links")
    id = Column(Integer, primary_key=True)

    def __init__(self,
                 name: str,
                 descrip: str = None,
                 start_date: date = datetime.now().date(),
                 status: str = "In Development"):
        self.name = name
        self.descrip = descrip
        self.start_date = start_date
        self.status = status

    def add_tools(self, tools: list):
        for i in tools: self.tools.append(i)
        db.session.commit()

    def get_start_date(self):
        return self.start_date.strftime("%B %d, %Y")

    def __str__(self):
        return "%d\t%s" % (self.id, self.name)


db.create_all()
