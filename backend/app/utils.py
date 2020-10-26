import pandas as pd
import asyncio

from io import StringIO

from .db import db

from .config import settings

from typing import List
from fastapi import UploadFile


def reorder_files(files: List[UploadFile]):
    order = {'battles.csv': 0, 'actors.csv': 1}
    return sorted(files, key=lambda f: order[f.filename])


async def uploaded_csv_to_dict(csv_file: UploadFile):
    file_content = await csv_file.read()
    return pd.read_csv(StringIO(file_content.decode('utf-8')), sep=',').to_dict(
        'records'
    )


async def import_csv_battles_into_db(battle_csv_files: List[UploadFile]):
    battles, actors = reorder_files(battle_csv_files)

    battles, actors = await asyncio.gather(
        asyncio.ensure_future(uploaded_csv_to_dict(battles)),
        asyncio.ensure_future(uploaded_csv_to_dict(actors))
    )

    for i in range(len(battles)):
        battles[i].update({'actors': []})

    battles = dict((b['battle_id'], b) for b in battles)

    for actor_record in actors:
        battle_id = actor_record['battle_id']
        del actor_record['battle_id']
        battles[battle_id]['actors'].append(actor_record)

    await db[settings.MONGODB_COLLECTION].insert_many(list(battles.values()))


async def db_get_battles(limit, page_num, sort_by, war, actor):
    query = {}
    sort = []

    if war is not None:
        query.update({
            'war': war
        })

    if actor is not None:
        query.update({
            'actors': {'$elemMatch': {'actor_name': actor}}
        })

    if sort_by is not None:
        sort.append((sort_by, 1))

    skip_size = limit * (page_num - 1)

    total = await db[settings.MONGODB_COLLECTION].count_documents(query)
    cursor = db[settings.MONGODB_COLLECTION].find(
        query, {'_id': 0}, sort=sort).skip(skip_size).limit(limit)
    battles = await cursor.to_list(None)
    return battles, total
