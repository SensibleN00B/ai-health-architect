from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.health import HealthLogCreate, HealthLogResponse, WeightHistoryItem
from app.services.health_service import HealthService

router = APIRouter()

@router.post("/", response_model=HealthLogResponse)
async def log_health_entry(
    entry: HealthLogCreate,
    db: AsyncSession = Depends(get_db),
) -> HealthLogResponse:
    service = HealthService(db)
    return await service.log_health_entry(
        user_id=entry.user_id,
        category=entry.category,
        description=entry.description,
        data=entry.data,
        photo_url=entry.photo_url
    )

@router.get("/{user_id}", response_model=list[HealthLogResponse])
async def get_health_history(
    user_id: int, 
    category: str | None = None,
    db: AsyncSession = Depends(get_db)
) -> list[HealthLogResponse]:
    service = HealthService(db)
    return await service.get_health_entries(user_id, category)

@router.get("/history/{user_id}", response_model=list[WeightHistoryItem])
async def get_weight_history_endpoint(
    user_id: int, 
    days: int = 30, 
    db: AsyncSession = Depends(get_db)
) -> list[WeightHistoryItem]:
    service = HealthService(db)
    return await service.get_weight_history(user_id, days)
