from abc import ABC, abstractmethod

from app.core.ai_types import (
    ClassificationResult,
    FoodAnalysisResult,
    HealthAnalysisResult,
    WorkoutAnalysisResult,
)


class AIProvider(ABC):
    """Abstract base class for AI providers"""

    @abstractmethod
    async def classify_photo(self, image_bytes: bytes) -> ClassificationResult:
        pass

    @abstractmethod
    async def analyze_food_image(self, image_bytes: bytes) -> FoodAnalysisResult:
        pass

    @abstractmethod
    async def analyze_workout_image(self, image_bytes: bytes) -> WorkoutAnalysisResult:
        pass

    @abstractmethod
    async def analyze_health_image(self, image_bytes: bytes) -> HealthAnalysisResult:
        pass

    @abstractmethod
    async def chat(self, user_message: str, context: str | None = None) -> str:
        pass
