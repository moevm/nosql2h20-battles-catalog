from .db import db
from .utils import import_csv_battles_into_db, db_get_battles

from typing import List
from fastapi import APIRouter, Request
from fastapi import File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse

router = APIRouter()


def error_response(msg: str):
    return JSONResponse(
        status_code=500,
        content={
            'message': f'Server error, got: {msg}'.replace('\"', '')
        })


@router.get('/')
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


@router.get('/battles')
async def get_battles(limit: int, page: int, sort: str = None, war: str = None, actor: str = None):
    battles, total = await db_get_battles(limit, page, sort, war, actor)

    return {
        'battles': battles,
        'total': total,
        'current_page': page
    }


@router.post('/upload')
async def import_battle_files(files: List[UploadFile] = File(...)):
    await import_csv_battles_into_db(files)

    return JSONResponse(
        status_code=200,
        content={
            'message': 'Files uploaded successfully'
        })
