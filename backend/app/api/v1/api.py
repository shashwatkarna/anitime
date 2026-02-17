from fastapi import APIRouter
from app.api.v1.endpoints import anime, calculate

api_router = APIRouter()
api_router.include_router(anime.router, prefix="/anime", tags=["anime"])
api_router.include_router(calculate.router, prefix="/calculate", tags=["calculate"])
