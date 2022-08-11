import pymysql
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

pymysql.install_as_MySQLdb()


app = Flask(__name__)
db = SQLAlchemy()


def create_app(config):
    app.config.from_object(config)
    db.init_app(app)

    with app.app_context():
        from GitSome.views.repos import repos
        from GitSome.views.todos import todos

        app.register_blueprint(repos)
        app.register_blueprint(todos)

        db.create_all()

        return app
