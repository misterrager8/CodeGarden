from flask import Flask
from flask_scss import Scss
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import pymysql

db = SQLAlchemy()
login_manager = LoginManager()
pymysql.install_as_MySQLdb()


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    login_manager.init_app(app)
    Scss(app, asset_dir="ProjectManager/static")

    with app.app_context():
        from . import views

        db.create_all()

        return app
