import MySQLdb


class DB:
    """
CREATE TABLE IF NOT EXISTS projects(
project_id INT AUTO-INCREMENT,
name,
descrip,
start_date,
tools_used,
status,
PRIMARY KEY (project_id));
    """
    def __init__(self):
        pass

    @staticmethod
    def db_read(stmt: str) -> list:
        db = MySQLdb.connect("", "", "", "")
        cursor = db.cursor()
        try:
            cursor.execute(stmt)
            return cursor.fetchall()
        except MySQLdb.Error as e:
            print(e)

    @staticmethod
    def db_write(stmt: str):
        db = MySQLdb.connect("", "", "", "")
        cursor = db.cursor()
        try:
            cursor.execute(stmt)
            db.commit()
        except MySQLdb.Error as e:
            print(e)

    def create(self, new_project):
        stmt = "INSERT INTO projects() VALUES ()" % new_project
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
