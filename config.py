import dotenv
import os

dotenv.load_dotenv()

ENV = os.getenv("env")
DEBUG = os.getenv("debug")
SQLALCHEMY_DATABASE_URI = os.getenv("db_url")
SQLALCHEMY_TRACK_MODIFICATIONS = False
