from typing import List

from bson.json_util import dumps
from fastapi import FastAPI, Request
from fastapi import File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .utils import import_csv_battles_into_db
from .db import db


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

    app.db = db
    return app


app = create_app()


@app.exception_handler(Exception)
async def exception_handler(request: Request, e: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "message": f"Server error, got: {e}"
        })


@app.get('/')
async def root():
    # await db_work()
    # cursor = app.db.test.find({}, {'_id': 0})  # dropping _id
    # return [dumps(doc) async for doc in cursor]
    content = '''
<body>
<form action="/upload" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
</body>
    '''
    return HTMLResponse(content=content)


@app.get('/battle/')
async def get_battle(battle_id: int):
    battle = await db.test.find_one({'battle_id': battle_id}, {'_id': 0})
    if battle is None:
        raise KeyError('DB doesn\'t contain battle with given id')
    return battle


@app.post("/upload")
async def import_battle_files(files: List[UploadFile] = File(...)):
    response = {
        'status': 'ok',
        'msg': 'Uploaded successfully'
    }

    filenames = set(['battles.csv', 'commanders.csv',
                     'actors.csv', 'durations.csv'])

    if filenames != set([f.filename for f in files]):
        response['status'] = 'fail'
        response['msg'] = f'Files missing one of the following: {filenames}'
        return response

    await import_csv_battles_into_db(files)

    return JSONResponse(
        status_code=200,
        content={
            'message': 'Files uploaded successfully'
        })
