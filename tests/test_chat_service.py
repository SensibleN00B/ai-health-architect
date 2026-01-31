import pytest
from app.services.chat_service import ChatService
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_chat_response():
    mock_ai = AsyncMock()
    # Mocking chat response
    mock_ai.chat.return_value = "AI Response"
    
    # Mock DB to fetch context (simplified for now)
    mock_db = AsyncMock()
    
    service = ChatService(mock_db, mock_ai)
    response = await service.chat(user_id=1, message="Hello")
    
    assert response == "AI Response"
