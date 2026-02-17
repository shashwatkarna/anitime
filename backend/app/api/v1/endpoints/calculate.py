from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()

class CalculateRequest(BaseModel):
    total_episodes: int
    episode_duration: int = 24 # default 24 mins
    episodes_per_day: Optional[int] = None
    minutes_per_day: Optional[int] = None
    target_date: Optional[str] = None # YYYY-MM-DD

class CalculateResponse(BaseModel):
    total_minutes: int
    total_hours: float
    days_required: int
    finish_date: str
    episodes_per_day: Optional[float] = None
    minutes_per_day: Optional[int] = None

@router.post("/", response_model=CalculateResponse)
async def calculate_watch_time(request: CalculateRequest):
    total_minutes = request.total_episodes * request.episode_duration
    total_hours = round(total_minutes / 60, 1)
    
    today = datetime.now().date()

    # Mode 1: Episodes per day
    if request.episodes_per_day:
        episodes_per_day = request.episodes_per_day
        if episodes_per_day <= 0:
             raise HTTPException(status_code=400, detail="Episodes per day must be positive")
             
        days_required = (request.total_episodes + episodes_per_day - 1) // episodes_per_day # Ceil
        finish_date = today + timedelta(days=days_required)
        
        return CalculateResponse(
            total_minutes=total_minutes,
            total_hours=total_hours,
            days_required=days_required,
            finish_date=finish_date.strftime("%Y-%m-%d"),
            episodes_per_day=episodes_per_day
        )

    # Mode 2: Minutes per day
    elif request.minutes_per_day:
        minutes_per_day = request.minutes_per_day
        if minutes_per_day <= 0:
             raise HTTPException(status_code=400, detail="Minutes per day must be positive")
        
        days_required = (total_minutes + minutes_per_day - 1) // minutes_per_day # Ceil
        finish_date = today + timedelta(days=days_required)
        
        # Calculate equivalent episodes per day for reference
        avg_eps = round(minutes_per_day / request.episode_duration, 1)

        return CalculateResponse(
            total_minutes=total_minutes,
            total_hours=total_hours,
            days_required=days_required,
            finish_date=finish_date.strftime("%Y-%m-%d"),
            minutes_per_day=minutes_per_day,
            episodes_per_day=avg_eps
        )
    
    # Mode 3: Target Date
    elif request.target_date:
        try:
            target = datetime.strptime(request.target_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
            
        if target <= today:
             raise HTTPException(status_code=400, detail="Target date must be in the future")
        
        days_available = (target - today).days
        if days_available == 0: 
             days_available = 1 # Avoid division by zero, finish today
             
        # Episodes needed
        episodes_needed = (request.total_episodes + days_available - 1) // days_available
        
        return CalculateResponse(
            total_minutes=total_minutes,
            total_hours=total_hours,
            days_required=days_available,
            finish_date=request.target_date,
            episodes_per_day=episodes_needed
        )
    
    else:
        raise HTTPException(status_code=400, detail="Must provide episodes_per_day, minutes_per_day, or target_date")
