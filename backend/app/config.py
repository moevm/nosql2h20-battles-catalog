import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    MONGODB_HOST: str = os.getenv('MONGODB_HOST') or 'localhost'
    MONGODB_PORT: int = 27017
    MONGODB_COLLECTION: str = 'battles'


settings = Settings()
