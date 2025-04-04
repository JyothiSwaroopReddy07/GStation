from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from typing import List, Optional
from datetime import date
import models
import schemas
import database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

@app.get("/logs/", response_model=List[schemas.CigaretteLogResponse])
def read_logs(date: Optional[date] = None, db: Session = Depends(database.get_db)):
    if date:
        logs = db.execute(
            select(models.CigaretteLog).where(models.CigaretteLog.date == date)
        ).scalars().all()

        if logs:
            return logs

        latest_prev_date = db.execute(
            select(models.CigaretteLog.date)
            .where(models.CigaretteLog.date < date)
            .order_by(models.CigaretteLog.date.desc())
            .limit(1)
        ).scalar()

        if latest_prev_date:
            previous_logs = db.execute(
                select(models.CigaretteLog).where(models.CigaretteLog.date == latest_prev_date)
            ).scalars().all()

            transformed_logs = []
            for log in previous_logs:
                transformed_logs.append(models.CigaretteLog(
                    rack=log.rack,
                    pack_name=log.pack_name,
                    date=date,
                    start_am=log.end_pm,
                    start_pm=0,
                    end_am=0,
                    end_pm=0,
                    count_sold_am=0,
                    count_sold_pm=0,
                    stocked_am=0,
                    stocked_pm=0,
                    purchase_of_the_day=0,
                    sold_pack=0,
                    stocked_carton=0
                ))

            return transformed_logs

        return []

    return db.execute(select(models.CigaretteLog)).scalars().all()

@app.post("/logs/", response_model=List[schemas.CigaretteLogResponse])
def save_logs(payload: schemas.CigaretteLogBatchRequest, db: Session = Depends(database.get_db)):
    for row_data in payload.rows:
        # Delete existing row if it exists (based on composite key)
        db.query(models.CigaretteLog).filter_by(
            date=payload.date,
            rack=row_data.rack,
            pack_name=row_data.pack_name
        ).delete()

        log = models.CigaretteLog(**row_data.dict(), date=payload.date)
        db.add(log)

    db.commit()

    all_logs = db.execute(
        select(models.CigaretteLog).where(models.CigaretteLog.date == payload.date)
    ).scalars().all()

    return all_logs

@app.put("/logs/{date}/{rack}/{pack_name}")
def update_log(date: date, rack: int, pack_name: str, log: schemas.CigaretteLogCreate, db: Session = Depends(database.get_db)):
    db_log = db.query(models.CigaretteLog).filter(
        and_(
            models.CigaretteLog.date == date,
            models.CigaretteLog.rack == rack,
            models.CigaretteLog.pack_name == pack_name
        )
    ).first()

    if not db_log:
        raise HTTPException(status_code=404, detail="Log not found")

    for key, value in log.dict().items():
        setattr(db_log, key, value)

    db.commit()
    return {"status": "updated"}

@app.delete("/logs/{date}/{rack}/{pack_name}")
def delete_log(date: date, rack: int, pack_name: str, db: Session = Depends(database.get_db)):
    db_log = db.query(models.CigaretteLog).filter(
        and_(
            models.CigaretteLog.date == date,
            models.CigaretteLog.rack == rack,
            models.CigaretteLog.pack_name == pack_name
        )
    ).first()

    if not db_log:
        raise HTTPException(status_code=404, detail="Log not found")

    db.delete(db_log)
    db.commit()
    return {"status": "deleted"}
