from pydantic import BaseModel
from typing import Optional

class AnimeBase(BaseModel):
    mal_id: int
    title: str
    episodes: Optional[int] = None
    episode_duration: Optional[int] = None
    image_url: Optional[str] = None
    synopsis: Optional[str] = None
    score: Optional[float] = None

class AnimeCreate(AnimeBase):
    pass

class Anime(AnimeBase):
    id: int

    class Config:
        from_attributes = True
