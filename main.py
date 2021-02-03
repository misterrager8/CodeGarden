from modules.db_ctrla import DB
from modules.objects import Project

if __name__ == "__main__":
    DB()
    Project("name", "descrip", "02/02/21", ["tool1", "tool2"])
