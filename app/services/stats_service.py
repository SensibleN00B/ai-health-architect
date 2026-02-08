from datetime import date, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Meal, Workout
from app.services.types import StatsSummaryItem

class StatsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_daily_summary(self, user_id: int, day: date | None = None) -> StatsSummaryItem:
        if day is None:
            day = datetime.now().date()
        
        start_of_day = datetime.combine(day, datetime.min.time())
        end_of_day = datetime.combine(day, datetime.max.time())
        
        # Calories
        meal_query = select(func.sum(Meal.calories)).where(
            Meal.user_id == user_id,
            Meal.timestamp >= start_of_day,
            Meal.timestamp <= end_of_day
        )
        meal_result = await self.db.execute(meal_query)
        calories = meal_result.scalar() or 0
        
        # Workouts
        workout_query = select(func.count(Workout.id), func.sum(Workout.duration_minutes)).where(
            Workout.user_id == user_id,
            Workout.timestamp >= start_of_day,
            Workout.timestamp <= end_of_day
        )
        workout_result = await self.db.execute(workout_query)
        count, duration = workout_result.one()
        
        return {
            "date": day.isoformat(),
            "calories": int(calories),
            "workout_count": count or 0,
            "workout_duration": duration or 0
        }

    async def get_history(self, user_id: int, days: int = 7) -> list[StatsSummaryItem]:
        # This approach is inefficient (N+1 queries), but simple for MVP.
        # Better: Group by date in SQL.
        # SQLite support for date grouping can be tricky with timezone aware datetimes, 
        # but let's try a loop for the last N days for simplicity and reliability now.
        
        history = []
        today = datetime.now().date()
        
        for i in range(days):
            day = today - timedelta(days=i)
            stats = await self.get_daily_summary(user_id, day)
            history.append(stats)
            
        return history
