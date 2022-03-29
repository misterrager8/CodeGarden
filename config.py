import os

import dotenv

dotenv.load_dotenv()

DEBUG = os.getenv("debug")
ENV = os.getenv("flask_env")
SQLALCHEMY_DATABASE_URI = os.getenv("db_url")
SECRET_KEY = os.getenv("secret_key")
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ENGINE_OPTIONS = {"pool_recycle": 60}
