import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

HOME_DIR = Path(os.getenv("home_dir"))
PORT = os.getenv("port")

settings_dict = dict(HOME_DIR=str(HOME_DIR), PORT=PORT)
