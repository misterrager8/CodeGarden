import os

import dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

dotenv.load_dotenv()

host = os.getenv("host")
user = os.getenv("user")
passwd = os.getenv("passwd")
db = os.getenv("db")

engine = create_engine(f"mysql://{user}:{passwd}@{host}/{db}")
# use session_factory() to get a new Session
_SessionFactory = sessionmaker(bind=engine)

Base = declarative_base()


def session_factory():
    Base.metadata.create_all(engine)
    return _SessionFactory()
