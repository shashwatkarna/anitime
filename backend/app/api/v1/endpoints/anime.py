from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Any
from app.db.session import get_db
from app.services.jikan import jikan_service
from app.schemas.anime import Anime, AnimeCreate

router = APIRouter()

@router.get("/search")
async def search_anime(
    q: str = Query(..., min_length=3),
    limit: int = 10
):
    """
    Search for anime using Jikan API.
    """
    try:
        results = await jikan_service.search_anime(q, limit)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/popular")
async def get_popular_anime(
    limit: int = 10,
    filter: str = Query(None, description="Filter for top anime (airing, upcoming, bypopularity, favorite)")
):
    """
    Get popular anime with optional filter.
    """
    try:
        results = await jikan_service.get_top_anime(limit, filter)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{mal_id}")
async def get_anime_details(mal_id: int):
    """
    Get specific anime details.
    """
    try:
        result = await jikan_service.get_anime_by_id(mal_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail="Anime not found")
