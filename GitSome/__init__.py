from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy()


def create_app(config):
    app.config.from_object(config)
    db.init_app(app)

    with app.app_context():
        from . import views

        db.create_all()

        return app
