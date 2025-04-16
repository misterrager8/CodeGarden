from code_garden import config
from code_garden.web import create_app

app = create_app(config)
if __name__ == "__main__":
    app.run(debug=True, port=config.PORT)
