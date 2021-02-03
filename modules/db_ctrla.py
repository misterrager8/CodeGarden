import os

import MySQLdb
from dotenv import load_dotenv


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

    def create(self, new_project):
        stmt = "INSERT INTO projects (name, descrip, start_date, tools_used, status) VALUES ()" % new_project
        self.db_write(stmt)
        print("Added.")

    def read(self):
        stmt = "SELECT * FROM projects"
        self.db_read(stmt)

    def update(self, project_id):
        stmt = "UPDATE projects SET - = - WHERE project_id = '%d'" % project_id
        self.db_write(stmt)
        print("Updated.")

    def delete(self, project_id):
        stmt = "DELETE FROM projects WHERE project_id = '%d'" % project_id
        self.db_write(stmt)
        print("Deleted.")
