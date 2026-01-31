import pytest
from app.core.ai_gemini import GeminiAI
from unittest.mock import MagicMock, patch

@pytest.mark.asyncio
async def test_analyze_workout_image():
    # Mock the Gemini client and response
    with patch('google.genai.Client') as MockClient:
        mock_client_instance = MockClient.return_value
        mock_response = MagicMock()
        mock_response.text = """
        Activity: Running
        Duration: 30
        Distance: 5.0
        Calories: 300
        Metrics: {"pace": "6:00 min/km"}
        """
        mock_client_instance.models.generate_content.return_value = mock_response

        ai = GeminiAI()
        # Mocking the client again purely to ensure it's the one we expect if __init__ creates it
        ai.client = mock_client_instance
        
        # We expect this to fail initially as the method doesn't exist
        result = await ai.analyze_workout_image(b"fake_image_bytes")
        
        assert result["activity"] == "Running"
        assert result["duration_minutes"] == 30
        assert result["distance_km"] == 5.0
        assert result["calories"] == 300
        assert result["metrics"]["pace"] == "6:00 min/km"
