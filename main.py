import modules.ctrla
from modules.model import Project

if __name__ == "__main__":
    x = Project("TEST2Name", "TEST2Descrip", "TEST2Tools")
    modules.ctrla.DB().create(x)
