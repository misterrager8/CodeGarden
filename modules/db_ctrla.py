import csv
import os
from typing import List

import MySQLdb
from dotenv import load_dotenv

from modules.objects import Project


class DB:
    def __init__(self):
        load_dotenv()
        self.conn = MySQLdb.connect(os.getenv("host"),
                                    os.getenv("user"),
                                    os.getenv("passwd"),
                                    os.getenv("db"))
        self.cursor = self.conn.cursor()
        # create_table_stmt = "CREATE TABLE IF NOT EXISTS projects(" \
        #                     "project_id INT AUTO_INCREMENT," \
        #                     "name TEXT NOT NULL," \
        #                     "descrip TEXT NOT NULL," \
        #                     "start_date TEXT NOT NULL," \
        #                     "tools_used TEXT NOT NULL," \
        #                     "status TEXT NOT NULL," \
        #                     "PRIMARY KEY (project_id));"
        # self.db_write(create_table_stmt)

    def db_read(self, stmt: str) -> list:
        """Generic MySQL read query"""
        try:
            self.cursor.execute(stmt)
            return self.cursor.fetchall()
        except MySQLdb.Error as e:
            print(e)

    def db_write(self, stmt: str):
        """Generic MySQL write query"""
        try:
            self.cursor.execute(stmt)
            self.conn.commit()
        except MySQLdb.Error as e:
            print(e)

        self.conn.close()

    def add_project(self, new_project: Project):
        """Add project to DB"""
        stmt = "INSERT INTO projects (name, descrip, start_date, tools_used, status) VALUES ('%s','%s','%s','%s','%s')" % (
            new_project.name, new_project.descrip, new_project.start_date, new_project.tools_used, new_project.status)
        self.db_write(stmt)
        print("Added.")

    def get_all_projects(self) -> List[Project]:
        """Get all projects in DB"""
        results = []
        stmt = "SELECT * FROM projects"
        for row in self.db_read(stmt):
            results.append(Project(row[1], row[2], row[3], row[4], row[5], row[0]))

        return results

    # def edit_project(self, project_id: int):
    #     """Edit project"""
    #     stmt = "UPDATE projects SET - = - WHERE project_id = '%d'" % project_id
    #     self.db_write(stmt)
    #     print("Updated.")

    def delete_project(self, project_id: int):
        """Delete project from DB"""
        stmt = "DELETE FROM projects WHERE project_id = '%d'" % project_id
        self.db_write(stmt)
        print("Deleted.")

    def delete_all_projects(self):
        """Delete all projects from DB"""
        stmt = "TRUNCATE table projects"
        self.db_write(stmt)
        print("All deleted.")

    def import_projects(self):
        """Import multiple projects from CSV file into DB"""
        imported = []
        with open("input.csv") as file:
            csv_data = csv.reader(file)
            for row in csv_data:
                csv_proj = Project(row[0], row[1], row[2], row[3])
                imported.append(csv_proj)

        print(str(len(imported)) + " project(s) found.")
        for item in imported:
            item.to_string()

        answer = input("Add these projects? ")
        if answer == "Y" or answer == "y":
            for item in imported:
                self.add_project(item)

    def get_project_by_id(self, project_id: int) -> list:
        """Find project w/ specified id"""
        stmt = "SELECT * FROM projects WHERE project_id = '%d'" % project_id
        return self.db_read(stmt)
