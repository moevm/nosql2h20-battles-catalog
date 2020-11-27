from pydantic import BaseModel
from typing import List


class BattleActorModel(BaseModel):
    name: str
    isWinner: bool
    armyName: str
    size: int
    losses: int
    commanders: List[str]


class BattleModel(BaseModel):
    name: str
    war: str
    start: str
    end: str
    actors: List[BattleActorModel]