"""Database controller """

import sqlite3

from code_garden import config


class Connector:
    def __init__(self):
        self.db = sqlite3.connect(config.HOME_DIR / "todos.db", check_same_thread=False)

    def write(self, stmt: str, params=()):
        with self.db as db:
            cursor = db.cursor()
            cursor.execute(stmt, params)

    def read(self, stmt: str, params=()):
        results = None
        with self.db as db:
            cursor = db.cursor()
            cursor.execute(stmt, params)

            results = cursor.fetchall()

        return results
