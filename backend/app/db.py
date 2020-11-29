from motor.motor_asyncio import AsyncIOMotorClient

from .config import settings


def setup_db():
    return AsyncIOMotorClient(settings.MONGODB_URI)[settings.MONGODB_DB_NAME]


db = setup_db()
