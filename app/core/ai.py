from app.core.config import settings
from app.core.ai_base import AIProvider


def get_ai_client() -> AIProvider:
    """
    Factory function to get the configured AI provider.
    
    Returns:
        AIProvider instance (GeminiAI for now)
    """
    if settings.AI_PROVIDER == "gemini":
        from app.core.ai_gemini import GeminiAI
        return GeminiAI()
    elif settings.AI_PROVIDER == "openai":
        from app.core.ai_openai import OpenAIProvider
        return OpenAIProvider()
    else:
        raise ValueError(
            f"Unknown AI provider: {settings.AI_PROVIDER}. "
            "Must be 'gemini' or 'openai'"
        )


ai_client = get_ai_client()
