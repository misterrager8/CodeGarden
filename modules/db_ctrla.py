import MySQLdb


class DB:
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

    def create(self, new_object):
        stmt = "INSERT INTO - () VALUES ()" % new_object
        self.db_write(stmt)
        print("Added.")

    def read(self):
        stmt = "SELECT * FROM -"
        self.db_read(stmt)

    def update(self, object_id):
        stmt = "UPDATE - SET - = - WHERE _id = '%d'" % object_id
        self.db_write(stmt)
        print("Updated.")

    def delete(self, object_id):
        stmt = "DELETE FROM - WHERE _id = '%d'" % object_id
        self.db_write(stmt)
        print("Deleted.")
