from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.stats import StatsSummary
from app.services.stats_service import StatsService

router = APIRouter()

@router.get("/{user_id}", response_model=StatsSummary)
async def get_user_stats(
    user_id: int,
    date_str: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> StatsSummary:
    service = StatsService(db)
    query_date = date.fromisoformat(date_str) if date_str else None
    summary = await service.get_daily_summary(user_id, query_date)
    return StatsSummary.model_validate(summary)

@router.get("/{user_id}/history", response_model=list[StatsSummary])
async def get_user_history(
    user_id: int,
    days: int = 7,
    db: AsyncSession = Depends(get_db),
) -> list[StatsSummary]:
    service = StatsService(db)
    history = await service.get_history(user_id, days)
    return [StatsSummary.model_validate(item) for item in history]
