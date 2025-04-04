from pydantic import BaseModel
from datetime import date
from typing import List

class CigaretteLogCreate(BaseModel):
    date: date
    rack: int
    pack_name: str
    start_am: int
    stocked_am: int
    end_am: int
    count_sold_am: int
    start_pm: int
    stocked_pm: int
    end_pm: int
    count_sold_pm: int
    purchase_of_the_day: int
    sold_pack: float
    stocked_carton: float

    class Config:
        orm_mode = True

class CigaretteLogResponse(BaseModel):
    rack: int
    pack_name: str
    start_am: int
    stocked_am: int
    end_am: int
    count_sold_am: int
    start_pm: int
    stocked_pm: int
    end_pm: int
    count_sold_pm: int
    purchase_of_the_day: int
    sold_pack: float
    stocked_carton: float

    class Config:
        orm_mode = True

class CigaretteLogBatchRequest(BaseModel):
    date: date
    rows: List[CigaretteLogResponse]
