from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import Workout
from typing import List, Dict, Any, Optional

class WorkoutService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_workout(self, user_id: int, description: str, duration_minutes: Optional[int] = None, 
                           intensity: Optional[str] = None, activity_type: Optional[str] = None, 
                           metrics: Optional[Dict[str, Any]] = None) -> Workout:
        workout = Workout(
            user_id=user_id,
            description=description,
            duration_minutes=duration_minutes,
            intensity=intensity,
            activity_type=activity_type,
            metrics=metrics
        )
        self.db.add(workout)
        await self.db.commit()
        await self.db.refresh(workout)
        return workout

    async def get_workouts(self, user_id: int, limit: int = 10) -> List[Workout]:
        stmt = select(Workout).where(Workout.user_id == user_id).order_by(Workout.timestamp.desc()).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_workout_by_id(self, workout_id: int) -> Optional[Workout]:
        result = await self.db.execute(select(Workout).where(Workout.id == workout_id))
        return result.scalar_one_or_none()
