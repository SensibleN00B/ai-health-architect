from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import Meal
from typing import List, Dict, Any

class MealService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_meal(self, user_id: int, description: str, calories: float, macros: Dict[str, int], photo_url: str = None) -> Meal:
        meal = Meal(
            user_id=user_id,
            description=description,
            calories=calories,
            macros=macros,
            photo_url=photo_url
        )
        self.db.add(meal)
        await self.db.commit()
        await self.db.refresh(meal)
        return meal

    async def get_user_meals(self, user_id: int, limit: int = 10) -> List[Meal]:
        stmt = select(Meal).where(Meal.user_id == user_id).order_by(Meal.timestamp.desc()).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()
