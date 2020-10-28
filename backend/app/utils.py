import asyncio
from collections import defaultdict
from io import StringIO
from typing import List

import pandas as pd
from fastapi import UploadFile
from pymongo import UpdateOne

from .config import settings
from .db import db


def _reorder_files(files: List[UploadFile]):
    order = {'battles.csv': 0, 'actors.csv': 1}
    return sorted(files, key=lambda f: order[f.filename])


async def _uploaded_csv_to_dict(csv_file: UploadFile):
    file_content = await csv_file.read()
    return pd.read_csv(StringIO(file_content.decode('utf-8')), sep=',').to_dict(
        'records'
    )


async def db_import_csv_battles(battle_csv_files: List[UploadFile]):
    def _check_winner(battle, actor):
        attacker_won = battle['attacker_won']
        is_attacker = actor['is_attacker']
        if attacker_won == 0:
            return False
        if attacker_won > 0:
            return is_attacker
        else:
            return not is_attacker

    # reorder by name
    battles, actors = _reorder_files(battle_csv_files)

    battles, actors = await asyncio.gather(
        asyncio.ensure_future(_uploaded_csv_to_dict(battles)),
        asyncio.ensure_future(_uploaded_csv_to_dict(actors))
    )

    # prepare actors field
    for i in range(len(battles)):
        battles[i].update({'actors': []})

    battles = dict((b['battle_id'], b) for b in battles)

    # add actor to battle
    for actor_record in actors:
        battle_id = actor_record['battle_id']
        actor_record['is_winner'] = bool(_check_winner(battles[battle_id], actor_record))
        battles[battle_id]['actors'].append(actor_record)

    # insert into db, update if some battles already exist
    insert_update_battles = [UpdateOne({'battle_id': battle['battle_id']}, {'$set': battle}, upsert=True)
                             for battle in battles.values()]
    await db[settings.MONGODB_COLLECTION].bulk_write(insert_update_battles)
    # remove temp fields in all battles documents
    await db[settings.MONGODB_COLLECTION].update_many(
        {},
        {'$unset': {'attacker_won': 1, "actors.$[].is_attacker": 1, "actors.$[].battle_id": 1}}
    )


async def db_get_battles(limit: int, page_num: int, sort_by: str, names: str, wars: str, actors: str):
    query = {}
    sort = []

    if names is not None:
        query.update({
            'name': {"$in": names.split(',')}
        })

    if wars is not None:
        query.update({
            'war': {"$in": wars.split(',')}
        })

    if actors is not None:
        query.update({
            'actors': {'$elemMatch': {'actor_name': {"$in": actors.split(',')}}}
        })

    if sort_by is not None:
        sort.append((sort_by, 1))  # sort in ascending order

    skip_size = limit * (page_num - 1)

    total = await db[settings.MONGODB_COLLECTION].count_documents(query)
    cursor = db[settings.MONGODB_COLLECTION].find(query, {'_id': 0}, sort=sort).skip(skip_size).limit(limit)
    battles = await cursor.to_list(None)
    return battles, total


def group_by_actor(actors):
    grouped_actors = defaultdict(dict)
    for actor in actors:
        a_name = actor['actor_name']
        grouped_actors[a_name]['initial_state'] = grouped_actors[a_name].get('initial_state', 0) + actor[
            'initial_state']
        grouped_actors[a_name]['casualties'] = grouped_actors[a_name].get('casualties', 0) + actor['casualties']
        grouped_actors[a_name]['commanders'] = grouped_actors[a_name].get('commanders', set()) | set([actor['commander']])
        grouped_actors[a_name]['army_name'] = grouped_actors[a_name].get('army_name', set()) | set([actor['army_name']])
        grouped_actors[a_name]['actor_name'] = a_name
    return list(grouped_actors.values())


async def db_get_wars(limit: int, page_num: int, sort_by: str, names: str, actors: str):
    query = {}
    sort = 'datetime_min'

    if sort_by is not None:
        sort = sort_by

    if names is not None:
        query.update({
            'name': {'$in': names.split(',')}
        })

    if actors is not None:
        query.update({
            'actors': {'$elemMatch': {'actor_name': {'$in': actors.split(',')}}}
        })

    # aggregate battles by war, count battles for each war and count wars
    cursor = db[settings.MONGODB_COLLECTION].aggregate([
        {
            '$unwind': '$actors',
        },
        {
            '$group': {
                '_id': '$war',
                'actors': {'$push': '$actors'},
                'datetime_min': {'$min': '$datetime_min'},
                'datetime_max': {'$max': '$datetime_max'},
                'battles_num': {'$sum': 1},
            },
        },
        {
            '$project': {
                '_id': 0,
                'name': '$_id',
                'datetime_max': 1,
                'datetime_min': 1,
                'battles_num': {'$divide': ['$battles_num', 2]},
                'actors': 1,
            }
        },
        {'$match': query},
        {'$sort': {sort: 1}},
        {
            '$facet': {
                'wars': [
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

    for i in range(len(result_wars['wars'])):
        result_wars['wars'][i]['actors'] = group_by_actor(result_wars['wars'][i]['actors'])

    return result_wars['wars'], result_wars['total'][0]['count']


async def db_find_warname_battle(name: str, war: str):
    battle = await db[settings.MONGODB_COLLECTION].find_one({
        'war': war,
        'name': name,
    }, {'_id': 0})
    return battle
