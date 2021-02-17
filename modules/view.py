from PyInquirer import prompt


class CmdLnInterface:
    def __init__(self):
        main_options = [{
            'type': 'list',
            'name': 'main_options',
            'message': 'What do you want to do?',
            'choices': [
                "Add Project",
                "Delete Project",
                "Delete All Projects",
                "Import Projects"]}]

        # add_questions = [{
        #     'type': 'input',
        #     'name': 'project_name',
        #     'message': 'Name?'}]

        _ = prompt(main_options)
