from abc import ABC, abstractmethod
from typing import Dict


class AIProvider(ABC):
    """Abstract base class for AI providers"""
    
    @abstractmethod
    async def classify_photo(self, image_bytes: bytes) -> Dict:
        """
        Classify photo type (food, workout, health, other).
        
        Returns:
            {
                "type": str,  # "food", "workout", "health", "other"
                "confidence": str,  # "high", "medium", "low"
                "reasoning": str
            }
        """
        pass
    
    @abstractmethod
    async def analyze_food_image(self, image_bytes: bytes) -> Dict:
        """
        Analyze food image and return calorie estimate with macros.
        
        Returns:
            {
                "description": str,
                "calories": float,
                "macros": {"protein": int, "carbs": int, "fat": int}
            }
        """
        pass
    
    @abstractmethod
    async def analyze_workout_image(self, image_bytes: bytes) -> Dict:
        """
        Analyze workout image.
        Returns:
            {
                "activity": str,
                "duration_minutes": int,
                "distance_km": float,
                "calories": float,
                "metrics": dict
            }
        """
        pass

    @abstractmethod
    async def analyze_health_image(self, image_bytes: bytes) -> Dict:
        """
        Analyze health/progress image.
        Returns:
             {
                "category": str,
                "data": dict,
                "description": str
            }
        """
        pass
    
    @abstractmethod
    async def chat(self, user_message: str, context: str | None = None) -> str:
        """
        General health advice chat.
        
        Args:
            user_message: User's question or message
            context: Optional user context (age, weight, goals, etc.)
            
        Returns:
            AI response as string
        """
        pass
