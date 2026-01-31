from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()

@router.post("/sync", response_model=UserResponse)
async def sync_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Syncs user data from Telegram. Creates user if not exists, updates if exists.
    """
    service = UserService(db)
    user = await service.get_or_create_user(
        telegram_id=user_in.telegram_id,
        username=user_in.username
    )
    return user

from pydantic import BaseModel

class UserUpdate(BaseModel):
    telegram_id: int
    age: int | None = None
    weight: float | None = None
    height: float | None = None
    goal: str | None = None

@router.put("/profile")
async def update_profile(data: UserUpdate, db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    return await service.update_user(
        telegram_id=data.telegram_id,
        age=data.age,
        weight=data.weight,
        height=data.height,
        goal=data.goal
    )
