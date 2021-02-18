import datetime


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
        self.start_date = start_date
        self.tools_used = tools_used
        self.status = status
        self.project_id = project_id

    def to_string(self):
        print([self.project_id,
               self.name,
               self.descrip,
               self.tools_used,
               self.start_date,
               self.status])
