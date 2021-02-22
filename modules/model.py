import datetime

import modules
from modules.ctrla import DB


class Project:
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

        self.pc = modules.ctrla.DB()

    def create(self):
        stmt = "INSERT INTO projects (name, descrip, tools_used, start_date, status) VALUES ('%s','%s','%s','%s','%s')" % (
            self.name, self.descrip, self.tools_used, self.start_date, self.status)
        self.pc.db_write(stmt)

    def read(self):
        pass

    def update(self):
        pass

    def delete(self):
        pass

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
