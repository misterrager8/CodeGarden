import os

import dotenv

dotenv.load_dotenv()

CLI_COLOR = os.getenv("cli_color")
DEBUG = os.getenv("debug").lower() == "true"
ENV = os.getenv("env")
HOME_DIR = os.getenv("home_dir")
PORT = os.getenv("port")
