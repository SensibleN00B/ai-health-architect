import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.health_service import HealthService
from app.db.models import HealthLog

@pytest.mark.asyncio
async def test_log_health_entry():
    mock_session = AsyncMock()
    service = HealthService(mock_session)
    
    entry = await service.log_health_entry(
        user_id=123,
        category="weight",
        description="Weekly check-in",
        data={"value": 75.5, "unit": "kg"},
        photo_url="http://img.com/1.jpg"
    )
    
    assert isinstance(entry, HealthLog)
    assert entry.category == "weight"
    assert entry.data is not None
    assert entry.data["value"] == 75.5
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()

@pytest.mark.asyncio
async def test_get_health_entries():
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [
        HealthLog(id=1, category="weight", data={"val": 70}),
        HealthLog(id=2, category="weight", data={"val": 71})
    ]
    mock_session.execute.return_value = mock_result
    
    service = HealthService(mock_session)
    entries = await service.get_health_entries(user_id=123, category="weight")
    
    assert len(entries) == 2
    assert entries[1].data is not None
    assert entries[1].data["val"] == 71
