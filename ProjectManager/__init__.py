import pymysql
from flask import Flask
from flask_login import LoginManager
from flask_scss import Scss
from flask_sqlalchemy import SQLAlchemy

pymysql.install_as_MySQLdb()
db = SQLAlchemy()
login_manager = LoginManager()


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    Scss(app, asset_dir="ProjectManager/static")

    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        from . import views

        # db.drop_all()
        db.create_all()

        return app
