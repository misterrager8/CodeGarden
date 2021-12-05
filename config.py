import os

import dotenv

dotenv.load_dotenv()

DEBUG = True
ENV = "development"
SQLALCHEMY_DATABASE_URI = os.getenv("db_url")
SQLALCHEMY_TRACK_MODIFICATIONS = False
