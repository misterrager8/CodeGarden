from PyInquirer import prompt

from modules.ctrla import DB


class CmdLnInterface:
    def __init__(self):
        db_ctrla = DB()

        main_options = [{
            'type': 'list',
            'name': 'main_options',
            'message': 'What do you want to do?',
            'choices': [
                "Add Project",
                "Delete Project",
                "Delete All Projects",
                "Import Projects"]}]

        answer = prompt(main_options)
        if answer["main_options"] == "Add Project":
            pass
        elif answer["main_options"] == "Delete Project":
            pass
        elif answer["main_options"] == "Delete All Projects":
            pass
        elif answer["main_options"] == "Import Projects":
            pass

    @staticmethod
    def add():
        questions = [{
            'type': 'input',
            'name': 'project_name',
            'message': 'Name?'}]

        answer = prompt(questions)
        return answer

    @staticmethod
    def delete(self):
        questions = [{
            'type': 'input',
            'name': 'delete_id',
            'message': 'ID?'}]

        answer = prompt(questions)
        self.db_ctrla
        return answer

    @staticmethod
    def delete_all():
        questions = [{
            'type': 'confirm',
            'name': 'project_name',
            'message': 'Sure?'}]

        answer = prompt(questions)
        return answer

    @staticmethod
    def import_projects():
        questions = [{
            'type': 'confirm',
            'name': 'project_name',
            'message': 'Import these?'}]

        answer = prompt(questions)
        return answer
