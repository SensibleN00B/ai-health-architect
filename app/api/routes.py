from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.ai import ai_client
from typing import Dict, Any

router = APIRouter(prefix="/api")

@router.post("/analyze/classify")
async def classify_photo(file: UploadFile = File(...)) -> Dict[str, Any]:
    content = await file.read()
    # TODO: Add validation for mime type if needed
    result = await ai_client.classify_photo(content)
    return result

@router.post("/analyze/food")
async def analyze_food(file: UploadFile = File(...)) -> Dict[str, Any]:
    content = await file.read()
    result = await ai_client.analyze_food_image(content)
    return result

@router.post("/analyze/workout")
async def analyze_workout(file: UploadFile = File(...)) -> Dict[str, Any]:
    content = await file.read()
    result = await ai_client.analyze_workout_image(content)
    return result

@router.post("/analyze/health")
async def analyze_health(file: UploadFile = File(...)) -> Dict[str, Any]:
    content = await file.read()
    result = await ai_client.analyze_health_image(content)
    return result
