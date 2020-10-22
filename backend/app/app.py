from typing import List

from fastapi import FastAPI, Request
from fastapi import File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

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


def error_response(msg: str):
    return JSONResponse(
        status_code=500,
        content={
            "message": f"Server error, got: {msg}".replace('\"', '')
        })


@app.exception_handler(Exception)
async def exception_handler(request: Request, e: Exception):
    return error_response(str(e))


@ app.get('/')
async def root():
    content = '''
<body>
<form action="/upload" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
</body>
    '''
    return HTMLResponse(content=content)


@ app.get('/battle')
async def get_battle(battle_id: int):
    battle = await db.test.find_one({'battle_id': battle_id}, {'_id': 0})

    if battle is None:
        return error_response(f'DB doesn\'t contain battle with id={battle_id}')

    return battle


@ app.post("/upload")
async def import_battle_files(files: List[UploadFile] = File(...)):
    filenames_diff = set(['battles.csv', 'actors.csv',
                          'durations.csv']) - set([f.filename for f in files])

    if len(filenames_diff) > 0:
        return error_response(f'Files missing: {filenames_diff}')

    await import_csv_battles_into_db(files)

    return JSONResponse(
        status_code=200,
        content={
            'message': 'Files uploaded successfully'
        })
