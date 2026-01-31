import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from unittest.mock import patch, AsyncMock

@pytest.mark.asyncio
async def test_update_profile_endpoint():
    with patch("app.api.endpoints.users.UserService") as MockService:
        mock_instance = MockService.return_value
        # Use a simple object or dict that mimics the user model structure
        # FastAPI jsonable_encoder handles dicts fine. 
        # Ideally it should be an object with attributes if the code accesses attributes, 
        # but pure return passed to FastAPI can be a dict if response_model is not strict or matches.
        # Let's use a simple class or namedtuple if needed, but dict is safer for serialization if no Pydantic validation on return.
        # But wait, endpoint returns result of service directly.
        
        from app.db.models import User
        mock_user = User(telegram_id=123, age=30, weight=80)
        mock_instance.update_user = AsyncMock(return_value=mock_user)
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {"telegram_id": 123, "age": 30, "weight": 80}
            response = await client.put("/api/users/profile", json=payload)
            
        assert response.status_code == 200
        assert response.json()["age"] == 30
