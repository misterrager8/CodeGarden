from PyInquirer import prompt, print_json


class CmdLnInterface:
    def __init__(self):
        questions = [
            {
                'type': 'list',
                'name': 'theme',
                'message': 'What do you want to do?',
                'choices': [
                    "Add Project",
                    "Delete Project",
                    "Delete All Projects",
                    "Import Projects"
                ]
            }
        ]
        answers = prompt(questions)
        print_json(answers)
