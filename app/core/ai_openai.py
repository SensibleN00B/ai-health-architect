from app.core.ai_base import AIProvider
from app.core.ai_types import (
    ClassificationResult,
    FoodAnalysisResult,
    HealthAnalysisResult,
    WorkoutAnalysisResult,
)
from app.core.config import settings


class OpenAIProvider(AIProvider):
    def __init__(self) -> None:
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not configured")

    async def classify_photo(self, image_bytes: bytes) -> ClassificationResult:
        raise NotImplementedError("OpenAIProvider.classify_photo is not implemented")

    async def analyze_food_image(self, image_bytes: bytes) -> FoodAnalysisResult:
        raise NotImplementedError("OpenAIProvider.analyze_food_image is not implemented")

    async def analyze_workout_image(self, image_bytes: bytes) -> WorkoutAnalysisResult:
        raise NotImplementedError("OpenAIProvider.analyze_workout_image is not implemented")

    async def analyze_health_image(self, image_bytes: bytes) -> HealthAnalysisResult:
        raise NotImplementedError("OpenAIProvider.analyze_health_image is not implemented")

    async def chat(self, user_message: str, context: str | None = None) -> str:
        raise NotImplementedError("OpenAIProvider.chat is not implemented")
