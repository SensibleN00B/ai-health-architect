from pydantic_settings import BaseSettings
from pydantic import SecretStr
from typing import Literal


class Settings(BaseSettings):
    BOT_TOKEN: SecretStr
    
    AI_PROVIDER: Literal["gemini", "openai"] = "gemini"
    
    GEMINI_API_KEY: SecretStr | None = None
    
    OPENAI_API_KEY: SecretStr | None = None
    OPENAI_MODEL: str = "gpt-4o"
    
    DATABASE_URL: str = "sqlite+aiosqlite:///./health.db"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
