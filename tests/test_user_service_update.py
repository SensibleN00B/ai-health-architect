import pytest
from unittest.mock import AsyncMock
from app.services.user_service import UserService
from app.db.models import User

@pytest.mark.asyncio
async def test_update_user_fields():
    mock_db = AsyncMock()
    # Mock existing user
    existing_user = User(telegram_id=123, username="test", age=25, weight=70.0)
    
    # execute returns a result object (awaited), which has sync methods
    result_mock = AsyncMock() 
    # Important: scalar_one_or_none is synchronous on the Result object
    from unittest.mock import Mock
    result_mock = Mock()
    result_mock.scalar_one_or_none.return_value = existing_user
    
    mock_db.execute.return_value = result_mock
    
    service = UserService(mock_db)
    
    # Update fields
    updated = await service.update_user(
        telegram_id=123, 
        age=30, 
        weight=75.5, 
        height=180, 
        goal="muscle_gain"
    )
    
    assert updated is not None
    assert updated.age == 30
    assert updated.weight == 75.5
    assert updated.height == 180
    assert updated.goal == "muscle_gain"
    mock_db.commit.assert_called_once()
