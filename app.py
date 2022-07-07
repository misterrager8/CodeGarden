from GitSome import create_app
import config
import webview

app = create_app(config)

if __name__ == "__main__":
    app.run()
