import os

import dotenv

dotenv.load_dotenv()

ENV = os.getenv("env")
DEBUG = os.getenv("debug")
PORT = os.getenv("port")
SQLALCHEMY_DATABASE_URI = os.getenv("db_url")
SQLALCHEMY_TRACK_MODIFICATIONS = False
