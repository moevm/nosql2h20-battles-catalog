import os
from motor.motor_asyncio import AsyncIOMotorClient


def setup_db():
    return AsyncIOMotorClient(os.getenv('MONGODB_HOST') or 'localhost', 27017)['nosql2020-battles']