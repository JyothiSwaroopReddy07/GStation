from sqlalchemy import Column, Date, Integer, String, Float, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CigaretteLog(Base):
    __tablename__ = "cigarette_logs"

    date = Column(Date, nullable=False)
    rack = Column(Integer, nullable=False)
    pack_name = Column(String, nullable=False)

    start_am = Column(Integer, default=0)
    stocked_am = Column(Integer, default=0)
    end_am = Column(Integer, default=0)
    count_sold_am = Column(Integer, default=0)

    start_pm = Column(Integer, default=0)
    stocked_pm = Column(Integer, default=0)
    end_pm = Column(Integer, default=0)
    count_sold_pm = Column(Integer, default=0)

    purchase_of_the_day = Column(Integer, default=0)
    sold_pack = Column(Float, default=0)
    stocked_carton = Column(Float, default=0)

    __table_args__ = (
        PrimaryKeyConstraint('date', 'rack', 'pack_name'),
    )