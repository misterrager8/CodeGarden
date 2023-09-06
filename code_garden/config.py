import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

HOME_DIR = Path(os.getenv("home_dir") or Path(__file__).parent.parent / "garden-repos")
PORT = os.getenv("port") or "9995"

if not HOME_DIR.exists():
    HOME_DIR.mkdir()


def get():
    return {
        "HOME_DIR": str(HOME_DIR),
        "PORT": PORT,
    }


def set(key, value):
    dotenv.set_key(dotenv.find_dotenv(), key, value)
