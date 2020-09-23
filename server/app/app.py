from fastapi import FastAPI
from .db import setup_db
from bson.json_util import dumps

app = FastAPI()

db = setup_db()


async def db_work():
    await db.test.delete_many({})  # to avoid inserting every time
    data = [{k: v} for k, v in zip(['key'] * 5, list("abcde"))]
    await db.test.insert_many(data)


@app.get('/')
async def root():
    await db_work()
    cursor = db.test.find({}, {'_id': 0})  # dropping _id
    return [dumps(doc) async for doc in cursor]
