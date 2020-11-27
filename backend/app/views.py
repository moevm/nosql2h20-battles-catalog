import os
import secrets
from pathlib import Path
from typing import List

from fastapi import APIRouter
from fastapi import File, UploadFile, BackgroundTasks
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse

from .config import settings
from .utils import db_import_csv, db_get_battles, db_get_wars, db_find_warname_battle, db_export_csv, \
    db_find_unique_actors, db_create_battle, rmdir
from .models import BattleModel

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
async def get_battles(limit: int, page: int, sort: str = None, sort_dir: int = 1, names: str = None, wars: str = None,
                      actors: str = None, search: str = None):
    battles, total = await db_get_battles(limit, page, sort, sort_dir, names, wars, actors, search)
    return {
        'items': battles,
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


@router.post('/battle/create')
async def import_battle_files(battle: BattleModel):
    res = await db_create_battle(battle.dict())
    if res is None:
        return { 'message': 'create failed' }

    return {
        'message': 'battle created'
    }


@router.get('/actors')
async def get_actors():
    actors = await db_find_unique_actors()
    return {
        'actors': actors,
    }


@router.get('/wars')
async def get_wars(limit: int, page: int, sort: str = None, sort_dir: int = 1, names: str = None, actors: str = None,
                   search: str = None):
    wars, total = await db_get_wars(limit, page, sort, sort_dir, names, actors, search)
    return {
        'items': wars,
        'total': total,
        'current_page': page
    }


@router.post('/upload')
async def import_battle_files(files: List[UploadFile] = File(...)):
    await db_import_csv(files)
    return {
        'message': 'Files uploaded successfully'
    }


@router.get('/export')
async def download_battle_files(background_tasks: BackgroundTasks):
    export_dir = os.path.join(settings.TEMP_DIR, f'export_{secrets.token_urlsafe(16)}')
    zip_export_path = await db_export_csv(export_dir)
    background_tasks.add_task(rmdir, export_dir, settings.EXPORT_FILES_RM_DELAY)
    return FileResponse(path=zip_export_path, filename=Path(zip_export_path).name)
