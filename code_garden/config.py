import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

CLI_COLOR = os.getenv("cli_color")
DEBUG = os.getenv("debug").lower() == "true"
ENV = os.getenv("env")
HOME_DIR = Path(os.getenv("home_dir"))
PORT = os.getenv("port")
