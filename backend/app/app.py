from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import setup_db
from bson.json_util import dumps


def create_app():
    origins = [
        "http://localhost",
        "http://localhost:4200",
    ]

    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    db = setup_db()
    app.db = db
    return app


app = create_app()


async def db_work():
    await app.db.test.delete_many({})  # to avoid inserting every time
    data = [{k: v} for k, v in zip(['key'] * 5, list("abcde"))]
    await app.db.test.insert_many(data)


@app.get('/', response_class=HTMLResponse)
async def root():
    await db_work()
    cursor = app.db.test.find({}, {'_id': 0})  # dropping _id
    return [dumps(doc) async for doc in cursor]
