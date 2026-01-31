import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_classify_photo_endpoint():
    # Mock the AI provider
    from unittest.mock import AsyncMock, patch
    
    # Create a mock result
    mock_result = {
        "type": "food",
        "confidence": "high",
        "reasoning": "Looks like a salad"
    }

    # Patch the ai_client instance in the routes module
    with patch("app.api.routes.ai_client") as mock_ai:
        mock_ai.classify_photo = AsyncMock(return_value=mock_result)
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # Mocking file upload
            files = {'file': ('test.jpg', b'fake_bytes', 'image/jpeg')}
            response = await client.post("/api/analyze/classify", files=files)
        
        assert response.status_code == 200
        assert response.json()["type"] == "food"
