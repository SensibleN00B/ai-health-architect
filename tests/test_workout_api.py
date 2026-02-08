import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.database import get_db
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime

@pytest.fixture
def mock_db_session():
    mock = AsyncMock()
    mock.add = MagicMock()
    # Mock refresh to set ID and timestamp
    def mock_refresh(instance):
        instance.id = 1
        instance.timestamp = datetime.now()
    mock.refresh.side_effect = mock_refresh
    return mock

@pytest.fixture
def override_get_db(mock_db_session):
    async def _get_db():
        yield mock_db_session
    app.dependency_overrides[get_db] = _get_db
    yield
    app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_create_workout_endpoint(override_get_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "user_id": 123,
            "description": "Test Workout",
            "duration_minutes": 45,
            "intensity": "medium",
            "activity_type": "Running",
            "metrics": {"distance": 5.0}
        }
        # Note: trailing slash required if @router.post("/")
        response = await client.post("/api/workouts/", json=payload)
    
    # Allow 307 redirect if slash mapping is loose, but strict 201 expected
    if response.status_code == 307:
        response = await client.post("/api/workouts", json=payload)
        
    assert response.status_code == 201
    data = response.json()
    assert data["description"] == "Test Workout"
    assert data["id"] == 1

@pytest.mark.asyncio
async def test_get_workouts_endpoint(override_get_db, mock_db_session):
    # Mock database result
    from app.db.models import Workout
    mock_workout = Workout(
        id=1, 
        user_id=123, 
        description="Test Workout", 
        timestamp=datetime.now()
    )
    
    # Setup mock execution result
    mock_result = MagicMock()
    mock_result.scalars().all.return_value = [mock_workout]
    mock_db_session.execute.return_value = mock_result
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/workouts/123")
        
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["description"] == "Test Workout"
