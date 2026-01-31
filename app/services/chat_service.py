from sqlalchemy.ext.asyncio import AsyncSession
from app.core.ai_base import AIProvider

class ChatService:
    def __init__(self, db: AsyncSession, ai: AIProvider):
        self.db = db
        self.ai = ai

    async def chat(self, user_id: int, message: str) -> str:
        # Future: Fetch user context/history from DB
        context = "User is 25 years old, distinct goal: weight loss." 
        return await self.ai.chat(message, context=context)
