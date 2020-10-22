import pandas as pd
import asyncio

from io import StringIO

from .db import db

from typing import List
from fastapi import UploadFile


def reorder_files(files: List[UploadFile]):
    order = {"battles.csv": 0, "actors.csv": 1, "durations.csv": 2}
    return sorted(files, key=lambda f: order[f.filename])


async def uploaded_csv_to_dict(csv_file: UploadFile):
    file_content = await csv_file.read()
    return pd.read_csv(StringIO(file_content.decode("utf-8")), sep=",").to_dict(
        "records"
    )


async def import_csv_battles_into_db(battle_csv_files: List[UploadFile]):
    battles, actors, durations = reorder_files(battle_csv_files)

    battles, actors, durations = await asyncio.gather(
        asyncio.ensure_future(uploaded_csv_to_dict(battles)),
        asyncio.ensure_future(uploaded_csv_to_dict(actors)),
        asyncio.ensure_future(uploaded_csv_to_dict(durations)),
    )

    for i in range(len(battles)):
        battles[i].update({"actors": []})

    battles = dict((b["battle_id"], b) for b in battles)

    for actor_record in actors:
        battle_id = actor_record["battle_id"]
        del actor_record["battle_id"]
        battles[battle_id]["actors"].append(actor_record)

    for duration_record in durations:
        battles[duration_record["battle_id"]].update(duration_record)

    await db.test.insert_many(list(battles.values()))
