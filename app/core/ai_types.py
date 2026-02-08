from typing import Any, Literal, TypedDict


class ClassificationResult(TypedDict):
    type: Literal["food", "workout", "health", "other"]
    confidence: Literal["high", "medium", "low"]
    reasoning: str


class FoodAnalysisResult(TypedDict):
    description: str
    calories: float
    macros: dict[str, int]


class WorkoutAnalysisResult(TypedDict):
    activity: str
    duration_minutes: int
    distance_km: float
    calories: float
    metrics: dict[str, Any]


class HealthAnalysisResult(TypedDict):
    category: str
    data: dict[str, Any]
    description: str
