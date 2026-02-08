from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.workout import WorkoutCreate, WorkoutResponse
from app.services.workout_service import WorkoutService

router = APIRouter()

@router.post("/", response_model=WorkoutResponse, status_code=status.HTTP_201_CREATED)
async def create_workout(
    workout: WorkoutCreate,
    db: AsyncSession = Depends(get_db),
) -> WorkoutResponse:
    service = WorkoutService(db)
    workout_model = await service.create_workout(
        user_id=workout.user_id,
        description=workout.description,
        duration_minutes=workout.duration_minutes,
        intensity=workout.intensity,
        activity_type=workout.activity_type,
        metrics=workout.metrics
    )
    return WorkoutResponse.model_validate(workout_model)

@router.get("/{user_id}", response_model=list[WorkoutResponse])
async def get_workouts(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> list[WorkoutResponse]:
    service = WorkoutService(db)
    workouts = await service.get_workouts(user_id)
    return [WorkoutResponse.model_validate(item) for item in workouts]
