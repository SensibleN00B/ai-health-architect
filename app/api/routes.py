from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.core.ai import ai_client
from app.core.ai_types import (
    ClassificationResult,
    FoodAnalysisResult,
    HealthAnalysisResult,
    WorkoutAnalysisResult,
)
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.services.meal_service import MealService
from app.services.chat_service import ChatService
from pydantic import BaseModel

from app.api.endpoints import workouts, stats, users, health

router = APIRouter(prefix="/api")
router.include_router(workouts.router, prefix="/workouts", tags=["workouts"])
router.include_router(stats.router, prefix="/stats", tags=["stats"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(health.router, prefix="/health", tags=["health"])

@router.post("/analyze/classify")
async def classify_photo(file: UploadFile = File(...)) -> ClassificationResult:
    content = await file.read()
    # TODO: Add validation for mime type if needed
    result = await ai_client.classify_photo(content)
    return result

@router.post("/analyze/food")
async def analyze_food(file: UploadFile = File(...)) -> FoodAnalysisResult:
    content = await file.read()
    result = await ai_client.analyze_food_image(content)
    return result

@router.post("/analyze/workout")
async def analyze_workout(file: UploadFile = File(...)) -> WorkoutAnalysisResult:
    content = await file.read()
    result = await ai_client.analyze_workout_image(content)
    return result

@router.post("/analyze/health")
async def analyze_health(file: UploadFile = File(...)) -> HealthAnalysisResult:
    content = await file.read()
    result = await ai_client.analyze_health_image(content)
    result = await ai_client.analyze_health_image(content)
    return result

class MealCreate(BaseModel):
    user_id: int
    description: str
    calories: float
    macros: dict
    photo_url: str | None = None

@router.post("/meals")
async def save_meal(meal: MealCreate, db: AsyncSession = Depends(get_db)):
    service = MealService(db)
    return await service.create_meal(
        user_id=meal.user_id,
        description=meal.description,
        calories=meal.calories,
        macros=meal.macros,
        photo_url=meal.photo_url
    )

@router.get("/meals/{user_id}")
async def get_meals(user_id: int, db: AsyncSession = Depends(get_db)):
    service = MealService(db)
    return await service.get_user_meals(user_id)

class ChatRequest(BaseModel):
    user_id: int
    message: str

@router.post("/chat")
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    service = ChatService(db, ai_client)
    return await service.chat(request.user_id, request.message)

