import pytest
from app.services.meal_service import MealService
from app.db.models import Meal
from unittest.mock import AsyncMock, MagicMock

@pytest.mark.asyncio
async def test_create_meal():
    # Mock database session
    mock_session = AsyncMock()
    mock_session.add = MagicMock()
    
    service = MealService(mock_session)
    meal_data = {
        "user_id": 12345,
        "description": "Test Meal",
        "calories": 500.0,
        "macros": {"protein": 30, "carbs": 50, "fat": 20},
        "photo_url": "http://example.com/photo.jpg"
    }
    
    result = await service.create_meal(**meal_data)
    
    assert isinstance(result, Meal)
    assert result.description == "Test Meal"
    assert result.calories == 500.0
    # Verify add and commit were called
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
