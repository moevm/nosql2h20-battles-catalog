from typing import List

from fastapi import APIRouter
from fastapi import File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse

from .utils import db_import_csv_battles, db_get_battles, db_get_wars, db_find_warname_battle

router = APIRouter()


def error_response(msg: str):
    return JSONResponse(
        status_code=500,
        content={
            'message': msg
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
async def get_battles(limit: int, page: int, sort: str = None, names: str = None, wars: str = None, actors: str = None):
    battles, total = await db_get_battles(limit, page, sort, names, wars, actors)
    return {
        'battles': battles,
        'total': total,
        'current_page': page
    }


@router.get('/battle/exists')
async def battle_exists(name: str, war: str):
    battle = await db_find_warname_battle(name, war)
    return {
        'battle': battle,
        'exists': battle is not None
    }


@router.get('/wars')
async def get_wars(limit: int, page: int, sort: str = None, names: str = None, actors: str = None):
    wars, total = await db_get_wars(limit, page, sort, names, actors)
    return {
        'wars': wars,
        'total': total,
        'current_page': page
    }


@router.post('/upload')
async def import_battle_files(files: List[UploadFile] = File(...)):
    await db_import_csv_battles(files)
    return {
        'message': 'Files uploaded successfully'
    }
