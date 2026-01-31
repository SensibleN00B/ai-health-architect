import pytest
from unittest.mock import AsyncMock, Mock
from app.services.health_service import HealthService
from app.db.models import HealthLog
from datetime import datetime

@pytest.mark.asyncio
async def test_get_weight_history():
    mock_db = AsyncMock()
    
    # Mock data
    log1 = HealthLog(
        id=1, 
        user_id=123, 
        category="weight", 
        data={"weight": 80.5}, 
        timestamp=datetime.now()
    )
    log2 = HealthLog(
        id=2, 
        user_id=123, 
        category="weight", 
        data={"weight": 79.8}, 
        timestamp=datetime.now()
    )
    
    # Setup mock result
    result_mock = Mock()
    result_mock.scalars.return_value.all.return_value = [log1, log2]
    mock_db.execute.return_value = result_mock
    
    service = HealthService(mock_db)
    
    history = await service.get_weight_history(user_id=123, days=30)
    
    assert len(history) == 2
    assert history[0]["weight"] == 80.5
    assert history[1]["weight"] == 79.8
    assert "date" in history[0]
