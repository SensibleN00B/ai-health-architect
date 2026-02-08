from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import User

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_user(self, telegram_id: int, username: str | None = None) -> User:
        """
        Retrieves a user by telegram_id. 
        If user does not exist, creates a new one.
        If user exists and username implies an update, updates it.
        """
        stmt = select(User).where(User.telegram_id == telegram_id)
        result = await self.db.execute(stmt)
        user = result.scalar_one_or_none()

        if user:
            # Update username if it changed and is provided
            if username and user.username != username:
                user.username = username
                await self.db.commit()
                await self.db.refresh(user)
            return user
        
        # Create new user
        new_user = User(telegram_id=telegram_id, username=username)
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user

    async def update_user(
        self,
        telegram_id: int,
        age: int | None = None,
        weight: float | None = None,
        height: int | None = None,
        goal: str | None = None,
    ) -> User | None:
        stmt = select(User).where(User.telegram_id == telegram_id)
        result = await self.db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if user:
            if age is not None: user.age = age
            if weight is not None: user.weight = weight
            if height is not None: user.height = height
            if goal is not None: user.goal = goal
            
            await self.db.commit()
            await self.db.refresh(user)
            return user
        return None
