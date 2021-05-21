from datetime import datetime, date

from sqlalchemy import Column, Text, Integer, Date
from sqlalchemy.orm import relationship

from modules import db


class Project(db.Model):
    __tablename__ = "projects"

    name = Column(Text)
    descrip = Column(Text)
    tools_used = relationship("tool", backref="project")
    start_date = Column(Date)
    status = Column(Text)
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

    def __str__(self):
        return "%d\t%s" % (self.id, self.name)


class Tool(db.Model):
    __tablename__ = "tools"

    name = Column(Text)
    color = Column(Text)
    id = Column(Integer, primary_key=True)

    def __init__(self,
                 name: str,
                 color: str):
        self.name = name
        self.color = color

    def __str__(self):
        return "%d\t%s" % (self.id, self.name)


db.create_all()
