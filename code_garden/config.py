import os

import dotenv

dotenv.load_dotenv()

HOME_DIR = os.getenv("home_dir")
CLI_COLOR = os.getenv("cli_color")
PORT = os.getenv("port")
ENV = os.getenv("env")
DEBUG = os.getenv("debug")
