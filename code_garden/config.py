import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

DEBUG = os.getenv("debug").lower() == "true"
ENV = os.getenv("env")
HOME_DIR = Path(os.getenv("home_dir"))
PORT = os.getenv("port")

settings_dict = dict(DEBUG=DEBUG, ENV=ENV, HOME_DIR=str(HOME_DIR), PORT=PORT)
