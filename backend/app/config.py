import os
from pathlib import Path

from pydantic import BaseSettings

__all__ = ['settings']

CONFIG_DIR = Path(__file__).absolute().parent


class Settings(BaseSettings):
    MONGODB_HOST: str = os.getenv('MONGODB_HOST') or 'localhost'
    MONGODB_PORT: int = 27017
    MONGODB_DB_NAME: str = 'nosql2020-battles'
    MONGODB_COLLECTION: str = 'battles'
    SERVER_DIR: str = str(Path(CONFIG_DIR).absolute().parent)
    TEMP_DIR: str = SERVER_DIR + '/tmp'


settings = Settings()
