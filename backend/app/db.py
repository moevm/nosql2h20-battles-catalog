import os
from .config import settings

from motor.motor_asyncio import AsyncIOMotorClient


def setup_db():
    return AsyncIOMotorClient(settings.MONGODB_HOST, settings.MONGODB_PORT)['nosql2020-battles']


db = setup_db()
