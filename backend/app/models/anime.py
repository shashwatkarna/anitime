from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from app.db.session import Base
from datetime import datetime

class Anime(Base):
    __tablename__ = "anime"

    id = Column(Integer, primary_key=True, index=True)
    mal_id = Column(Integer, unique=True, index=True)
    title = Column(String, index=True)
    episodes = Column(Integer)
    episode_duration = Column(Integer) # in minutes
    image_url = Column(String)
    synopsis = Column(String)
    score = Column(Float)
    last_updated = Column(DateTime, default=datetime.utcnow)
