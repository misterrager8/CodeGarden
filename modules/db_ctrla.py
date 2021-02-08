import os

import MySQLdb
from dotenv import load_dotenv
from typing import List

from modules.objects import Project


class DB:
    def __init__(self):
        load_dotenv()
        create_table_stmt = "CREATE TABLE IF NOT EXISTS projects(" \
                            "project_id INT AUTO_INCREMENT," \
                            "name TEXT NOT NULL," \
                            "descrip TEXT NOT NULL," \
                            "start_date TEXT NOT NULL," \
                            "tools_used TEXT NOT NULL," \
                            "status TEXT NOT NULL," \
                            "PRIMARY KEY (project_id));"
        self.db_write(create_table_stmt)

    @staticmethod
    def db_read(stmt: str) -> list:
        db = MySQLdb.connect(os.getenv("host"),
                             os.getenv("user"),
                             os.getenv("passwd"),
                             os.getenv("db"))
        cursor = db.cursor()
        try:
            cursor.execute(stmt)
            return cursor.fetchall()
        except MySQLdb.Error as e:
            print(e)

    @staticmethod
    def db_write(stmt: str):
        db = MySQLdb.connect(os.getenv("host"),
                             os.getenv("user"),
                             os.getenv("passwd"),
                             os.getenv("db"))
        cursor = db.cursor()
        try:
            cursor.execute(stmt)
            db.commit()
        except MySQLdb.Error as e:
            print(e)

        db.close()

    def create(self, new_project: Project):
        stmt = "INSERT INTO projects (name, descrip, start_date, tools_used, status) VALUES ('%s','%s','%s','%s','%s')" % (
            new_project.name, new_project.descrip, new_project.start_date, new_project.tools_used, new_project.status)
        self.db_write(stmt)
        print("Added.")

    def read(self) -> List[Project]:
        results = []
        stmt = "SELECT * FROM projects"
        for row in self.db_read(stmt):
            results.append(Project(row[1], row[2], row[3], row[4], row[5], row[0]))

        return results

    def update(self, project_id: int):
        stmt = "UPDATE projects SET - = - WHERE project_id = '%d'" % project_id
        self.db_write(stmt)
        print("Updated.")

    def delete(self, project_id: int):
        stmt = "DELETE FROM projects WHERE project_id = '%d'" % project_id
        self.db_write(stmt)
        print("Deleted.")
