import modules.base
from modules.base import session_factory
import modules.model
import sqlalchemy.ext.declarative
import sqlalchemy.orm


class DB(modules.base.Base):
    def __init__(self):
        pass

    @staticmethod
    def create(new_object):
        session = modules.base.session_factory()
        session.add(new_object)
        session.commit()
        session.close()
