from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Optional
from app.db.database import get_db
from app.services.stats_service import StatsService
from datetime import date

router = APIRouter()

@router.get("/{user_id}")
async def get_user_stats(user_id: int, date_str: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    service = StatsService(db)
    query_date = date.fromisoformat(date_str) if date_str else None
    return await service.get_daily_summary(user_id, query_date)

@router.get("/{user_id}/history")
async def get_user_history(user_id: int, days: int = 7, db: AsyncSession = Depends(get_db)):
    service = StatsService(db)
    return await service.get_history(user_id, days)
