from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.models import User
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter()

@router.post("/sync", response_model=UserResponse)
async def sync_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """
    Syncs user data from Telegram. Creates user if not exists, updates if exists.
    """
    service = UserService(db)
    user = await service.get_or_create_user(
        telegram_id=user_in.telegram_id,
        username=user_in.username
    )
    return UserResponse.model_validate(user)

class UserUpdate(BaseModel):
    telegram_id: int
    age: int | None = None
    weight: float | None = None
    height: int | None = None
    goal: str | None = None

@router.put("/profile", response_model=None)
async def update_profile(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
) -> User | None:
    service = UserService(db)
    return await service.update_user(
        telegram_id=data.telegram_id,
        age=data.age,
        weight=data.weight,
        height=data.height,
        goal=data.goal
    )
