from motor.motor_asyncio import AsyncIOMotorClient


def setup_db():
    return AsyncIOMotorClient()['nosql2020-battles']