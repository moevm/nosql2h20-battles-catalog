import asyncio
import os
import shutil
import subprocess
import tempfile
from datetime import datetime
from io import StringIO
from typing import List, Dict
from functools import reduce

import pandas as pd
from fastapi import UploadFile, HTTPException
import dateutil.parser

from .config import settings
from .db import db


async def rmdir(path, delay=0):
    await asyncio.sleep(delay)
    shutil.rmtree(path)


def mkdir(path):
    os.makedirs(path)


def _reorder_files(files: List[UploadFile]):
    order = {'battles.csv': 0, 'actors.csv': 1}
    return sorted(files, key=lambda f: order[f.filename])


async def _uploaded_csv_to_dict(csv_file: UploadFile):
    file_content = await csv_file.read()
    return pd.read_csv(StringIO(file_content.decode('utf-8')), sep=',').to_dict(
        'records'
    )


async def db_get_battles(limit: int, page_num: int, sort_by: str, sort_dir: int, names: str, wars: str, actors: str,
                         search: str):

    if search is not None and names is not None:
        raise HTTPException(status_code=422, detail='query contains both "names" and "search" in GET /wars')

    query = {}
    sort = 'battle_id'

    if names is not None:
        query.update({
            'name': {'$in': names.split(',')}
        })

    if search is not None:
        query.update({
            'name': {'$regex': search, '$options': 'i'}
        })

    if wars is not None:
        query.update({
            'war': {'$in': wars.split(',')}
        })

    if actors is not None:
        query.update({
            'actors': {'$elemMatch': {'actor_name': {"$in": actors.split(',')}}}
        })

    if sort_by is not None:
        sort = [(sort_by, sort_dir)]

    total = await db[settings.MONGODB_COLLECTION].count_documents(query)
    cursor = db[settings.MONGODB_COLLECTION].find(query, {'_id': 0}).sort(sort).skip(limit * (page_num - 1)).limit(limit)
    battles = await cursor.to_list(None)
    return battles, total


def group_by_actor(actors):        
    df_actors = pd.DataFrame(actors)
    df_actors = df_actors.groupby('actor_name', as_index=False).agg({
        'initial_state': 'sum',
        'casualties': 'sum',
        'army_name': lambda x: set(x),
        'commander': lambda x: set(c for cc in [cc.split(',') for cc in x] for c in cc)
    })
    return df_actors.to_dict('records')


async def db_get_wars(limit: int, page_num: int, sort_by: str, sort_dir: int, names: str, actors: str, search: str):
    if search is not None and names is not None:
        raise HTTPException(status_code=422, detail='query contains both "names" and "search" in GET /wars')

    query = {}
    sort = {'datetime_min': sort_dir}

    if sort_by is not None:
        sort = {sort_by: sort_dir}

    if names is not None:
        query.update({
            'name': {'$in': names.split(',')}
        })

    if search is not None:
        query.update({
            'name': {'$regex': search, '$options': 'i'}
        })

    if actors is not None:
        query.update({
            'actors': {'$elemMatch': {'actor_name': {'$in': actors.split(',')}}}
        })

    cursor = db[settings.MONGODB_COLLECTION].aggregate([
        {
            '$group': {
                '_id': '$war',
                'actors': {'$push': '$actors'},
                'datetime_min': {'$min': '$datetime_min'},
                'datetime_max': {'$max': '$datetime_max'},
                'total_state': {'$sum': '$total_state'},
                'total_casualties': {'$sum': '$total_casualties'},
                'duration': {'$sum': '$duration'},
                'battles_num': {'$sum': 1},
            },
        },
        {'$unwind': '$actors'},
        {'$unwind': '$actors'},
        {
            '$group': {
                '_id': '$_id',
                'actors': {'$push': '$actors'},
                'datetime_min': {'$first': '$datetime_min'},
                'datetime_max': {'$first': '$datetime_max'},
                'total_state': {'$first': '$total_state'},
                'total_casualties': {'$first': '$total_casualties'},
                'battles_num': {'$first': '$battles_num'},
            }
        },
        {
            '$set': {
                'name': '$_id',
                'duration': { "$subtract": [ "$datetime_max", "$datetime_min" ] },
            }
        },
        {'$project': {'_id': 0}},
        {'$match': query},
        {'$sort': sort},
        {
            '$facet': {
                'items': [
                    {'$skip': limit * (page_num - 1)},
                    {'$limit': limit}
                ],
                'total': [
                    {'$count': 'count'}
                ]
            }
        }
    ])

    wars = await cursor.to_list(None)
    result_wars = wars[0]

    for i in range(len(result_wars['items'])):
        result_wars['items'][i]['actors'] = group_by_actor(result_wars['items'][i]['actors'])

    total = 0
    if len(result_wars['total']) > 0:
        total = result_wars['total'][0]['count']

    return result_wars['items'], total


async def db_find_warname_battle(name: str, war: str):
    battle = await db[settings.MONGODB_COLLECTION].find_one({
        'war': war,
        'name': name,
    }, {'_id': 0})
    return battle


async def db_import_csv(battle_csv_files: List[UploadFile]):
    battles, actors = _reorder_files(battle_csv_files)

    with tempfile.TemporaryDirectory(prefix='import') as td:
        battles_temp_path = os.path.abspath(td) + '/battles.csv'
        actors_temp_path = os.path.abspath(td) + '/actors.csv'

        with open(battles_temp_path, "wb") as temp_battles:
            shutil.copyfileobj(battles.file, temp_battles)

        with open(actors_temp_path, "wb") as temp_actors:
            shutil.copyfileobj(actors.file, temp_actors)

        import_battles_cmd = f'''
        mongoimport {settings.MONGODB_URI} \
                    --db={settings.MONGODB_DB_NAME} \
                    --collection={settings.MONGODB_COLLECTION} \
                    --mode merge --upsertFields=battle_id \
                    --type=csv --headerline \
                    --file=\"{battles_temp_path}\"
        '''
        import_actors_cmd = f'''
        mongoimport {settings.MONGODB_URI} \
                    --db={settings.MONGODB_DB_NAME} \
                    --collection=temp_actors \
                    --mode merge --upsertFields=battle_id,actor_name,army_name \
                    --type=csv --headerline --ignoreBlanks\
                    --file=\"{actors_temp_path}\"
        '''
        subprocess.run(import_battles_cmd, shell=True)
        subprocess.run(import_actors_cmd, shell=True)

    await db[settings.MONGODB_COLLECTION].aggregate([
        {
            '$lookup': {
                'from': 'temp_actors',
                'localField': 'battle_id',
                'foreignField': 'battle_id',
                'as': 'actors'
            }
        },
        {
            '$set': { 
                'total_state': {'$sum': '$actors.initial_state'},
                'total_casualties': {'$sum': '$actors.casualties'},
                'datetime_min': {'$toDate': '$datetime_min'},
                'datetime_max': {'$toDate': '$datetime_max'},
            }
        },
        {
            '$set': { 
                'duration': { "$subtract": [ "$datetime_max", "$datetime_min" ] },
            }
        },
        {'$unset': ['actors.battle_id', 'actors._id']},
        {'$out': settings.MONGODB_COLLECTION}
    ]).to_list(None)

    await db.drop_collection('temp_actors')


async def db_export_csv(export_dir):
    await db[settings.MONGODB_COLLECTION].aggregate([
        {'$unwind': "$actors"},
        {'$addFields': {"actors.battle_id": "$battle_id"}},
        {'$project': {'_id': 0}},
        {'$replaceRoot': {'newRoot': "$actors"}},
        {'$out': "export_actors"}
    ]).to_list(None)

    await db[settings.MONGODB_COLLECTION].aggregate([
        {'$unset': ['actors', 'total_state', 'total_casualties', 'duration']},
        {'$project': {'_id': 0}},
        {'$out': "export_battles"}
    ]).to_list(None)

    mkdir(os.path.join(export_dir, 'csv'))

    export_battles_cmd = f'''
    mongoexport {settings.MONGODB_URI} \
                --db {settings.MONGODB_DB_NAME} \
                --collection export_battles \
                --type=csv --out {export_dir}/csv/battles.csv --fields battle_id,name,war,datetime_min,datetime_max
    '''

    export_actors_cmd = f'''
    mongoexport {settings.MONGODB_URI} \
                --db {settings.MONGODB_DB_NAME} \
                --collection export_actors \
                --type=csv --out {export_dir}/csv/actors.csv --fields battle_id,actor_name,army_name,commander,initial_state,casualties,is_winner
    '''

    subprocess.run(export_battles_cmd, shell=True)
    subprocess.run(export_actors_cmd, shell=True)

    await db.drop_collection('export_battles')
    await db.drop_collection('export_actors')

    return shutil.make_archive(
        os.path.join(export_dir, f'nosql2020_battles_{datetime.now().replace(microsecond=0)}'.replace(' ', '_')),
        'zip',
        os.path.join(export_dir, 'csv')
    )


async def db_find_unique_actors():
    return await db[settings.MONGODB_COLLECTION].distinct("actors.actor_name")


def rename_fields(battle: Dict) -> Dict:
    battle['datetime_min'] = dateutil.parser.parse(battle.pop('start'))
    battle['datetime_max'] = dateutil.parser.parse(battle.pop('end'))

    for i, actor in enumerate(battle['actors']):
        actor['actor_name'] = actor.pop('name')
        actor['army_name'] = actor.pop('armyName')
        actor['initial_state'] = actor.pop('size')
        actor['casualties'] = actor.pop('losses')
        actor['commander'] = ','.join(actor.pop('commanders'))
        actor['is_winner'] = actor.pop('isWinner')
        battle['actors'][i] = actor

    return battle


async def db_create_battle(battle: Dict):
    battle_exits = await db_find_warname_battle(battle['name'], battle['war'])
    if battle_exits:
        raise HTTPException(status_code=422, detail='battle with provided "name" and "war" already exists')

    battle = rename_fields(battle)
    max_battle_id_res = await db[settings.MONGODB_COLLECTION].aggregate([{
        '$group': {
            '_id': 'null',
            'battle_id': {'$max': '$battle_id'}
            }
        }
    ]).to_list(None)

    battle['battle_id'] = max_battle_id_res[0]['battle_id'] + 1 if len(max_battle_id_res) > 0 else 1

    total_state, total_casualties = reduce(lambda total, actor: (total[0] + actor['initial_state'], total[1] + actor['casualties']), battle['actors'], (0, 0))
    battle['total_state'] = total_state
    battle['total_casualties'] = total_casualties
    battle['duration'] = int((battle['datetime_max'] - battle['datetime_min']).total_seconds() * 1000)

    result = await db[settings.MONGODB_COLLECTION].insert_one(battle)
    return result.inserted_id

