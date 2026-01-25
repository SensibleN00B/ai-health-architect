import pytest
from app.core.ai import get_ai_client
from app.core.config import settings


def test_ai_factory_returns_gemini():
    """Test that factory returns Gemini provider when configured"""
    ai = get_ai_client()
    assert ai is not None
    
    if settings.AI_PROVIDER == "gemini":
        from app.core.ai_gemini import GeminiAI
        assert isinstance(ai, GeminiAI)
