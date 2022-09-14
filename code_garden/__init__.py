from flask import Flask


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    with app.app_context():
        from code_garden.views.repos import repos
        from code_garden.views.todos import todos

        app.register_blueprint(repos)
        app.register_blueprint(todos)

        return app
