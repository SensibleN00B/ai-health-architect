import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.user_service import UserService
from app.db.models import User

@pytest.mark.asyncio
async def test_get_or_create_user_creates_new():
    mock_session = AsyncMock()
    mock_session.add = MagicMock()
    # Mock execute result for "get" query to return None first
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_result
    
    service = UserService(mock_session)
    user = await service.get_or_create_user(telegram_id=12345, username="testuser")
    
    assert user.telegram_id == 12345
    assert user.username == "testuser"
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()

@pytest.mark.asyncio
async def test_get_or_create_user_returns_existing():
    mock_session = AsyncMock()
    existing_user = User(id=1, telegram_id=67890, username="oldname")
    
    # Mock execute result for "get" query to return existing_user
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = existing_user
    mock_session.execute.return_value = mock_result
    
    service = UserService(mock_session)
    # Passed username is different, check if it updates or just returns
    # For now, let's assume valid sync updates the username if provided
    user = await service.get_or_create_user(telegram_id=67890, username="newname")
    
    assert user.id == 1
    assert user.telegram_id == 67890
    assert user.username == "newname" # Verify update happened
    mock_session.commit.assert_called_once() # Should commit the update
