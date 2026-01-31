import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from unittest.mock import patch, AsyncMock

@pytest.mark.asyncio
async def test_create_meal_endpoint():
    # Mock the MealService
    with patch("app.api.routes.MealService") as MockService:
        mock_instance = MockService.return_value
        # Mock create_meal to return a dict or object that matches the router's expected response
        # The service returns a Meal model, validation converts it to schema or json
        # Let's mock it returning a simple dict for now if the router handles it, or a mock object
        # The router calls service.create_meal which returns a Meal object.
        # But FastAPI response_model will serialize it.
        # If we return a dict, it might work if Pydantic casts it.
        # Let's return a dict with attributes accessed by dot notation (Mock)
        # or just a dict if Pydantic works with it (Pydantic models from dict? No, from ORM objects)
        # The plan had `return_value={"id": 1, "description": "Test"}`. 
        # If the return type is a Pydantic model, it might expect object access.
        # If `from_attributes=True` (orm_mode) is set, it might need object access.
        # Let's try matching the plan exactly first.
        mock_instance.create_meal = AsyncMock(return_value={"id": 1, "description": "Test"})
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "user_id": 123,
                "description": "Chicken",
                "calories": 400,
                "macros": {"p": 20, "c": 20, "f": 10}
            }
            response = await client.post("/api/meals", json=payload)
            
        # We expect 200 presumably (Plan says 200)
        assert response.status_code == 200
        assert response.json()["description"] == "Test"
