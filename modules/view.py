import sys

from PyInquirer import prompt

import modules.ctrla
from modules.model import Project


class CmdLnInterface:
    def __init__(self):
        self.db = modules.ctrla.DB()

        main_options = [{
            'type': 'list',
            'name': 'main_options',
            'message': 'What do you want to do?',
            'choices': [
                "Add Project",
                "Delete Project",
                "Delete All Projects",
                "Import Projects",
                "Exit"]}]

        while True:
            self.view_all()
            answer = prompt(main_options)
            if answer["main_options"] == "Add Project":
                self.add()
            elif answer["main_options"] == "Delete Project":
                self.delete()
            elif answer["main_options"] == "Delete All Projects":
                self.delete_all()
            elif answer["main_options"] == "Import Projects":
                self.import_projects()
            elif answer["main_options"] == "Exit":
                sys.exit()

    def view_all(self):
        for i in self.db.get_all_projects():
            i.to_string()

    @staticmethod
    def add():
        questions = [
            {
                'type': 'input',
                'name': 'project_name',
                'message': 'Name?'
            },
            {
                'type': 'input',
                'name': 'project_descrip',
                'message': 'Descrip?'
            },
            {
                'type': 'input',
                'name': 'project_tools',
                'message': 'Tools used?'
            }
        ]

        answer = prompt(questions)
        x = Project(answer["project_name"],
                    answer["project_descrip"],
                    answer["project_tools"])
        x.create()

    def delete(self):
        questions = [{
            'type': 'input',
            'name': 'delete_id',
            'message': 'ID?'}]

        answer = prompt(questions)
        self.db.delete_project(int(answer["delete_id"]))

    def delete_all(self):
        questions = [{
            'type': 'confirm',
            'name': 'yesno',
            'message': 'Sure?'}]

        answer = prompt(questions)
        if answer["yesno"]:
            self.db.delete_all_projects()
        else:
            print("bye.")

    def import_projects(self):
        imported = self.db.import_projects()
        print(str(len(imported)) + " project(s) found.")
        for item in imported:
            item.to_string()

        questions = [{
            'type': 'confirm',
            'name': 'yesno',
            'message': 'Import these?'}]

        answer = prompt(questions)
        if answer["yesno"]:
            for item in imported:
                self.db.add_project(item)
        else:
            print("bye.")
