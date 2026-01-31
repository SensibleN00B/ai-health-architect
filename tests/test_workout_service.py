import pytest
from app.services.workout_service import WorkoutService
from app.db.models import Workout
from unittest.mock import AsyncMock, MagicMock

@pytest.mark.asyncio
async def test_create_workout():
    mock_session = AsyncMock()
    service = WorkoutService(mock_session)
    workout_data = {
        "user_id": 12345,
        "description": "Morning Run",
        "duration_minutes": 30,
        "intensity": "high",
        "activity_type": "Running",
        "metrics": {"distance": 5.0}
    }
    
    result = await service.create_workout(**workout_data)
    
    assert isinstance(result, Workout)
    assert result.description == "Morning Run"
    assert result.duration_minutes == 30
    
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once()

@pytest.mark.asyncio
async def test_get_workouts():
    mock_session = AsyncMock()
    service = WorkoutService(mock_session)
    
    # Mock execute result
    mock_result = MagicMock()
    mock_result.scalars().all.return_value = [Workout(id=1, description="Run")]
    mock_session.execute.return_value = mock_result
    
    result = await service.get_workouts(user_id=12345)
    
    assert len(result) == 1
    assert result[0].description == "Run"
    mock_session.execute.assert_called_once()

@pytest.mark.asyncio
async def test_get_workout_by_id():
    mock_session = AsyncMock()
    service = WorkoutService(mock_session)
    
    # Mock execute result
    mock_result = MagicMock()
    mock_workout = Workout(id=1, description="Run")
    mock_result.scalar_one_or_none.return_value = mock_workout
    mock_session.execute.return_value = mock_result
    
    result = await service.get_workout_by_id(workout_id=1)
    
    assert result == mock_workout
    mock_session.execute.assert_called_once()
