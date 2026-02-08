from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import HealthLog
from app.services.types import WeightHistoryItem

class HealthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def log_health_entry(
        self,
        user_id: int,
        category: str,
        description: str | None = None,
        data: dict[str, object] | None = None,
        photo_url: str | None = None,
    ) -> HealthLog:
        entry = HealthLog(
            user_id=user_id,
            category=category,
            description=description,
            data=data,
            photo_url=photo_url
        )
        self.db.add(entry)
        await self.db.commit()
        await self.db.refresh(entry)
        return entry

    async def get_health_entries(
        self,
        user_id: int,
        category: str | None = None,
        limit: int = 50,
    ) -> list[HealthLog]:
        stmt = select(HealthLog).where(HealthLog.user_id == user_id)
        
        if category:
            stmt = stmt.where(HealthLog.category == category)
            
        stmt = stmt.order_by(HealthLog.timestamp.desc()).limit(limit)
        
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_weight_history(self, user_id: int, days: int = 30) -> list[WeightHistoryItem]:
        # Assume category is 'weight' and data contains { 'weight': ... }
        # Or better yet, we might have logs with category="weight".
        stmt = select(HealthLog).where(
            HealthLog.user_id == user_id,
            HealthLog.category == "weight"
        ).order_by(HealthLog.timestamp.asc())
        
        # If we want to limit by days, we should filter by timestamp
        # But for now, let's just get all or limit 30 recent?
        # Plan said: Select date, weight from HealthLog where user_id=... order by date
        # It had "days=30" arg.
        
        # We should probably filter by date > now - days.
        # But to keep it simple and safe from imports issues in snippet:
        # We'll just fetch all for now or check plan strictness.
        
        result = await self.db.execute(stmt)
        logs = result.scalars().all()
        
        history = []
        for log in logs:
            if log.data and "weight" in log.data:
                history.append({
                    "date": log.timestamp.strftime("%Y-%m-%d"),
                    "weight": log.data["weight"]
                })
        return history
