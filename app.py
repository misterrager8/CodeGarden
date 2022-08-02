from GitSome import create_app
import config

app = create_app(config)

if __name__ == "__main__":
    app.run(port=5001)
