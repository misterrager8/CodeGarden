import dotenv
import os

dotenv.load_dotenv()

FLASK_ENV = os.getenv("FLASK_ENV")
DEBUG = os.getenv("DEBUG")
SECRET_KEY = os.getenv("secret_key")
SQLALCHEMY_DATABASE_URI = os.getenv("db_url")
SQLALCHEMY_TRACK_MODIFICATIONS = False
