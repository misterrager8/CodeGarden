import datetime
import os

import dotenv
from sqlalchemy import Column, Integer, String

import modules.base


dotenv.load_dotenv()

host = os.getenv("host")
user = os.getenv("user")
passwd = os.getenv("passwd")
db = os.getenv("db")

engine = create_engine(f"mysql://{user}:{passwd}@{host}/{db}")

class Project(modules.base.Base):
    __tablename__ = "projects"

    name = Column(String)
    descrip = Column(String)
    tools_used = Column(String)
    start_date = Column(String)
    status = Column(String)
    project_id = Column(Integer, primary_key=True)

    def __init__(self,
                 name: str,
                 descrip: str,
                 tools_used: str,
                 start_date: str = datetime.datetime.now().strftime("%Y-%m-%d"),
                 status: str = "In Progress",
                 project_id: int = None):
        self.name = name
        self.descrip = descrip
        self.tools_used = tools_used
        self.start_date = start_date
        self.status = status
        self.project_id = project_id

    def to_string(self):
        print([self.project_id,
               self.name,
               self.descrip,
               self.tools_used,
               self.start_date,
               self.status])


class Todo:
    def __init__(self,
                 todo_title: str,
                 date_added: str = datetime.datetime.now().strftime("%Y-%m-%d"),
                 done: bool = False,
                 project_id: int = None,
                 todo_id: int = None):
        self.todo_title = todo_title
        self.date_added = date_added
        self.done = done
        self.project_id = project_id
        self.todo_id = todo_id

    def to_string(self):
        print([self.todo_id,
               self.todo_title,
               self.date_added,
               self.done,
               self.project_id])
