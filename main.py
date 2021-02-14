from modules.ctrla import DB
from modules.model import Project
from modules.view import CmdLnInterface

if __name__ == "__main__":
    db = DB()
    test_data = [
        Project("Library", "Basic library app", "09/25/2018", "java"),
        Project("Hotel", "hotel project", "09/25/2017", "java"),
        Project("ToDo.py", "basic to do list app", "09/25/2019", "python,jython"),
        Project("AddressBook", "simple addressbook program", "09/25/2019", "python"),
        Project("MusicAnalyzer", "stats for nerds abut music habits", "09/25/2019", "python,pandas"),
        Project("BPBot", "reddit bot for GBN", "09/25/2020", "python,mysql,praw"),
        Project("BlogSite", "basic blog site", "09/25/2021", "python,html,css,flask")
    ]

    # for i in test_data: db.create(i)
    # for i in db.get_all_projects(): i.to_string()

    CmdLnInterface()
