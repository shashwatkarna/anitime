import httpx
from typing import Optional, Dict, Any

class JikanService:
    BASE_URL = "https://api.jikan.moe/v4"

    async def search_anime(self, query: str, limit: int = 5) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/anime",
                params={"q": query, "limit": limit}
            )
            response.raise_for_status()
            return response.json()

    async def get_anime_by_id(self, mal_id: int) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.BASE_URL}/anime/{mal_id}")
            response.raise_for_status()
            return response.json()

    async def get_top_anime(self, limit: int = 10, filter: Optional[str] = None) -> Dict[str, Any]:
        params = {"limit": limit}
        if filter:
            params["filter"] = filter
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/top/anime",
                params=params
            )
            response.raise_for_status()
            return response.json()

jikan_service = JikanService()
