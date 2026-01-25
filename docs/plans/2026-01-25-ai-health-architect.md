# AI Health Architect Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Telegram-based AI fitness assistant that tracks calories via photo analysis, logs workouts, provides health advice using AI (Gemini or OpenAI), and visualizes data through a Telegram Mini App.

**Architecture:** Monolithic Python backend (FastAPI) serving both REST API and Telegram Bot logic, with async SQLAlchemy for database operations. React SPA frontend built with Vite and served as static files by FastAPI. **Provider-agnostic AI integration** with support for both Gemini and OpenAI, switchable via configuration.

**Tech Stack:** 
- Backend: Python 3.11+, FastAPI, aiogram 3.x, SQLAlchemy 2.x (async), SQLite
- AI: Google Gemini 2.0 Flash (`google-generativeai`) **OR** OpenAI GPT-4 Vision (`openai`) - switchable
- Frontend: React 18, TypeScript, Vite, TailwindCSS, Recharts
- Deployment: Docker, docker-compose

---

## Task 1: Project Structure & Configuration

**Files:**
- Create: `requirements.txt`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `app/__init__.py`
- Create: `app/core/__init__.py`
- Create: `app/core/config.py`
- Create: `tests/__init__.py`
- Create: `tests/conftest.py`

**Step 1: Create requirements.txt**

```txt
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
aiogram>=3.3.0
sqlalchemy>=2.0.25
aiosqlite>=0.19.0
google-generativeai>=0.3.2
openai>=1.68.0
pydantic-settings>=2.1.0
python-dotenv>=1.0.1
python-multipart>=0.0.9
jinja2>=3.1.3
requests>=2.31.0
pytest>=8.0.0
pytest-asyncio>=0.23.0
httpx>=0.26.0
```

**Step 2: Create .env.example**

```env
BOT_TOKEN=your_telegram_bot_token_here

# AI Provider: "gemini" or "openai"
AI_PROVIDER=gemini

# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI Configuration  
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o

DATABASE_URL=sqlite+aiosqlite:///./health.db
```

**Step 3: Create .gitignore**

```gitignore
.env
.venv/
__pycache__/
*.pyc
*.db
node_modules/
frontend/dist/
app/web/
.pytest_cache/
.DS_Store
```

**Step 4: Create app/core/config.py**

```python
from pydantic_settings import BaseSettings
from pydantic import SecretStr
from typing import Literal


class Settings(BaseSettings):
    BOT_TOKEN: SecretStr
    
    # AI Provider Selection
    AI_PROVIDER: Literal["gemini", "openai"] = "gemini"
    
    # Gemini
    GEMINI_API_KEY: SecretStr | None = None
    
    # OpenAI
    OPENAI_API_KEY: SecretStr | None = None
    OPENAI_MODEL: str = "gpt-4o"
    
    DATABASE_URL: str = "sqlite+aiosqlite:///./health.db"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
```

**Step 5: Create test configuration (tests/conftest.py)**

```python
import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def test_db_engine():
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        echo=False
    )
    yield engine
    await engine.dispose()


@pytest.fixture
async def test_db_session(test_db_engine):
    async_session = async_sessionmaker(
        test_db_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
```

**Step 6: Initialize empty __init__.py files**

Run:
```bash
touch app/__init__.py app/core/__init__.py tests/__init__.py
```

**Step 7: Create virtual environment and install dependencies**

Run:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Step 8: Verify installation**

Run:
```bash
python -c "import fastapi, aiogram, sqlalchemy; print('All imports successful')"
```
Expected: `All imports successful`

**Step 9: Commit**

```bash
git init
git add .
git commit -m "chore: initial project structure and dependencies"
```

---

## Task 2: Database Models

**Files:**
- Create: `app/db/__init__.py`
- Create: `app/db/models.py`
- Create: `app/db/database.py`
- Create: `tests/test_db_models.py`

**Step 1: Write test for User model**

Create `tests/test_db_models.py`:

```python
import pytest
from app.db.models import User, Base


@pytest.mark.asyncio
async def test_user_model_creation(test_db_engine, test_db_session):
    async with test_db_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    user = User(
        telegram_id=123456789,
        username="test_user",
        age=25,
        weight=70.5,
        height=175,
        goal="lose_weight"
    )
    
    test_db_session.add(user)
    await test_db_session.commit()
    await test_db_session.refresh(user)
    
    assert user.id is not None
    assert user.telegram_id == 123456789
    assert user.username == "test_user"
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_db_models.py::test_user_model_creation -v`
Expected: FAIL with "cannot import name 'User'"

**Step 3: Create database engine (app/db/database.py)**

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

**Step 4: Create User model (app/db/models.py)**

```python
from sqlalchemy import Column, Integer, String, Float, DateTime, BigInteger, Text, JSON
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(BigInteger, unique=True, nullable=False, index=True)
    username = Column(String(255), nullable=True)
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Integer, nullable=True)
    goal = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Meal(Base):
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    description = Column(Text, nullable=True)
    calories = Column(Float, nullable=True)
    macros = Column(JSON, nullable=True)  # {"protein": X, "carbs": Y, "fat": Z}
    photo_url = Column(String(500), nullable=True)


class Workout(Base):
    __tablename__ = "workouts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    description = Column(Text, nullable=False)
    duration_minutes = Column(Integer, nullable=True)
    intensity = Column(String(20), nullable=True)  # low, medium, high
    activity_type = Column(String(50), nullable=True)  # running, gym, yoga, etc
    metrics = Column(JSON, nullable=True)  # {"distance_km": X, "calories_burned": Y, ...}


class HealthLog(Base):
    """Generic health log for photos that don't fit food/workout categories"""
    __tablename__ = "health_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    category = Column(String(50), nullable=False)  # weight, measurements, progress_photo, etc
    description = Column(Text, nullable=True)
    data = Column(JSON, nullable=True)  # flexible data storage
    photo_url = Column(String(500), nullable=True)
```

**Step 5: Update app/db/__init__.py**

```python
from app.db.models import Base, User, Meal, Workout, HealthLog
from app.db.database import engine, get_db, AsyncSessionLocal

__all__ = ["Base", "User", "Meal", "Workout", "HealthLog", "engine", "get_db", "AsyncSessionLocal"]
```

**Step 6: Run test to verify it passes**

Run: `pytest tests/test_db_models.py::test_user_model_creation -v`
Expected: PASS

**Step 7: Write test for Meal model**

Add to `tests/test_db_models.py`:

```python
@pytest.mark.asyncio
async def test_meal_model_creation(test_db_engine, test_db_session):
    async with test_db_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    meal = Meal(
        user_id=123456789,
        description="Grilled chicken with rice",
        calories=450.5,
        macros={"protein": 35, "carbs": 40, "fat": 12}
    )
    
    test_db_session.add(meal)
    await test_db_session.commit()
    await test_db_session.refresh(meal)
    
    assert meal.id is not None
    assert meal.calories == 450.5
    assert meal.macros["protein"] == 35
```

**Step 8: Run test to verify it passes**

Run: `pytest tests/test_db_models.py -v`
Expected: 2 PASSED

**Step 9: Commit**

```bash
git add app/db tests/test_db_models.py
git commit -m "feat: add database models for User, Meal, and Workout"
```

---

## Task 3: AI Provider Abstraction (Gemini + OpenAI)

**Files:**
- Create: `app/core/ai_base.py` (abstract interface)
- Create: `app/core/ai_gemini.py` (Gemini implementation)
- Create: `app/core/ai_openai.py` (OpenAI implementation)
- Create: `app/core/ai.py` (factory)
- Create: `tests/test_ai.py`

**Step 1: Write test for AI factory**

Create `tests/test_ai.py`:

```python
import pytest
from app.core.ai import get_ai_client
from app.core.config import settings


def test_ai_factory_returns_correct_provider():
    """Test that factory returns the configured provider"""
    ai = get_ai_client()
    assert ai is not None
    
    if settings.AI_PROVIDER == "gemini":
        from app.core.ai_gemini import GeminiAI
        assert isinstance(ai, GeminiAI)
    elif settings.AI_PROVIDER == "openai":
        from app.core.ai_openai import OpenAIProvider
        assert isinstance(ai, OpenAIProvider)
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_ai.py::test_ai_factory_returns_correct_provider -v`
Expected: FAIL with "cannot import name 'get_ai_client'"

**Step 3: Create abstract base class (app/core/ai_base.py)**

```python
from abc import ABC, abstractmethod
from typing import Dict


class AIProvider(ABC):
    """Abstract base class for AI providers"""
    
    @abstractmethod
    async def analyze_food_image(self, image_bytes: bytes) -> Dict:
        """
        Analyze food image and return calorie estimate with macros.
        
        Returns:
            {
                "description": str,
                "calories": float,
                "macros": {"protein": int, "carbs": int, "fat": int}
            }
        """
        pass
    
    @abstractmethod
    async def chat(self, user_message: str, context: str | None = None) -> str:
        """
        General health advice chat.
        
        Args:
            user_message: User's question or message
            context: Optional user context (age, weight, goals, etc.)
            
        Returns:
            AI response as string
        """
        pass
```

**Step 4: Create Gemini provider (app/core/ai_gemini.py)**

```python
import google.generativeai as genai
from app.core.ai_base import AIProvider
from app.core.config import settings
from typing import Dict
import re


class GeminiAI(AIProvider):
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not configured")
        
        genai.configure(api_key=settings.GEMINI_API_KEY.get_secret_value())
        self.model = genai.GenerativeModel("gemini-2.0-flash-exp")
    
    async def analyze_food_image(self, image_bytes: bytes) -> Dict:
        prompt = """
        Analyze this food image and provide:
        1. Description of the food items
        2. Estimated total calories
        3. Macronutrients breakdown (protein, carbs, fat in grams)
        
        Return ONLY in this exact format (no extra text):
        Description: [food description]
        Calories: [number]
        Protein: [grams]
        Carbs: [grams]
        Fat: [grams]
        """
        
        response = self.model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": image_bytes}
        ])
        
        return self._parse_food_response(response.text)
    
    async def chat(self, user_message: str, context: str | None = None) -> str:
        system_prompt = """
        You are a professional fitness and nutrition advisor.
        Provide helpful, evidence-based advice about health, nutrition, and fitness.
        Be encouraging and supportive. Keep responses concise (2-3 sentences).
        """
        
        full_prompt = f"{system_prompt}\n\n"
        if context:
            full_prompt += f"User context: {context}\n\n"
        full_prompt += f"User: {user_message}\nAssistant:"
        
        response = self.model.generate_content(full_prompt)
        return response.text
    
    def _parse_food_response(self, response_text: str) -> Dict:
        """Parse Gemini response into structured data"""
        result = {
            "description": "",
            "calories": 0.0,
            "macros": {"protein": 0, "carbs": 0, "fat": 0}
        }
        
        for line in response_text.strip().split("\n"):
            line = line.strip()
            if line.startswith("Description:"):
                result["description"] = line.replace("Description:", "").strip()
            elif line.startswith("Calories:"):
                try:
                    cal_match = re.search(r'\d+\.?\d*', line)
                    if cal_match:
                        result["calories"] = float(cal_match.group())
                except (ValueError, AttributeError):
                    pass
            elif line.startswith("Protein:"):
                try:
                    prot_match = re.search(r'\d+', line)
                    if prot_match:
                        result["macros"]["protein"] = int(prot_match.group())
                except (ValueError, AttributeError):
                    pass
            elif line.startswith("Carbs:"):
                try:
                    carb_match = re.search(r'\d+', line)
                    if carb_match:
                        result["macros"]["carbs"] = int(carb_match.group())
                except (ValueError, AttributeError):
                    pass
            elif line.startswith("Fat:"):
                try:
                    fat_match = re.search(r'\d+', line)
                    if fat_match:
                        result["macros"]["fat"] = int(fat_match.group())
                except (ValueError, AttributeError):
                    pass
        
        return result
```

**Step 5: Create OpenAI provider (app/core/ai_openai.py)**

```python
from openai import AsyncOpenAI
from app.core.ai_base import AIProvider
from app.core.config import settings
from typing import Dict
import base64
import re


class OpenAIProvider(AIProvider):
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not configured")
        
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY.get_secret_value()
        )
        self.model = settings.OPENAI_MODEL
    
    async def analyze_food_image(self, image_bytes: bytes) -> Dict:
        b64_image = base64.b64encode(image_bytes).decode("utf-8")
        
        prompt = """
        Analyze this food image and provide:
        1. Description of the food items
        2. Estimated total calories
        3. Macronutrients breakdown (protein, carbs, fat in grams)
        
        Return ONLY in this exact format (no extra text):
        Description: [food description]
        Calories: [number]
        Protein: [grams]
        Carbs: [grams]
        Fat: [grams]
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{b64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        return self._parse_food_response(response.choices[0].message.content)
    
    async def chat(self, user_message: str, context: str | None = None) -> str:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a professional fitness and nutrition advisor. "
                    "Provide helpful, evidence-based advice about health, nutrition, and fitness. "
                    "Be encouraging and supportive. Keep responses concise (2-3 sentences)."
                )
            }
        ]
        
        if context:
            messages.append({
                "role": "system",
                "content": f"User context: {context}"
            })
        
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=200
        )
        
        return response.choices[0].message.content
    
    def _parse_food_response(self, response_text: str) -> Dict:
        """Parse OpenAI response into structured data"""
        result = {
            "description": "",
            "calories": 0.0,
            "macros": {"protein": 0, "carbs": 0, "fat": 0}
        }
        
        for line in response_text.strip().split("\n"):
            line = line.strip()
            if line.startswith("Description:"):
                result["description"] = line.replace("Description:", "").strip()
            elif line.startswith("Calories:"):
                try:
                    cal_match = re.search(r'\d+\.?\d*', line)
                    if cal_match:
                        result["calories"] = float(cal_match.group())
                except (ValueError, AttributeError):
                    pass
            elif line.startswith("Protein:"):
                try:
                    prot_match = re.search(r'\d+', line)
                    if prot_match:
                        result["macros"]["protein"] = int(prot_match.group())
                except (ValueError, AttributeError):
                    pass
            elif line.startswith("Carbs:"):
                try:
                    carb_match = re.search(r'\d+', line)
                    if carb_match:
                        result["macros"]["carbs"] = int(carb_match.group())
                except (ValueError, AttributeError):
                    pass
            elif line.startswith("Fat:"):
                try:
                    fat_match = re.search(r'\d+', line)
                    if fat_match:
                        result["macros"]["fat"] = int(fat_match.group())
                except (ValueError, AttributeError):
                    pass
        
        return result
```

**Step 6: Create factory function (app/core/ai.py)**

```python
from app.core.config import settings
from app.core.ai_base import AIProvider


def get_ai_client() -> AIProvider:
    """
    Factory function to get the configured AI provider.
    
    Returns:
        AIProvider instance (either GeminiAI or OpenAIProvider)
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


# Singleton instance
ai_client = get_ai_client()
```

**Step 7: Run test to verify it passes**

Run: `pytest tests/test_ai.py::test_ai_factory_returns_correct_provider -v`
Expected: PASS

**Step 8: Write integration test**

Add to `tests/test_ai.py`:

```python
@pytest.mark.asyncio
async def test_ai_chat_interface():
    """Test that AI provider implements chat interface"""
    ai = get_ai_client()
    
    # This will make a real API call, so we just test the interface
    response = await ai.chat("What's a healthy breakfast?")
    assert isinstance(response, str)
    assert len(response) > 0
```

**Step 9: Commit**

```bash
git add app/core/ai*.py tests/test_ai.py
git commit -m "feat: add AI provider abstraction with Gemini and OpenAI support"
```

---

## Task 4: FastAPI Backend Setup

**Files:**
- Create: `app/api/__init__.py`
- Create: `app/api/routes.py`
- Create: `app/main.py`
- Create: `tests/test_api.py`

**Step 1: Write test for health check endpoint**

Create `tests/test_api.py`:

```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
    
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_api.py::test_health_check -v`
Expected: FAIL with "cannot import name 'app'"

**Step 3: Create API routes (app/api/routes.py)**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db, User, Meal, Workout
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api")


class UserProfile(BaseModel):
    telegram_id: int
    username: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[int] = None
    goal: Optional[str] = None


class MealLog(BaseModel):
    user_id: int
    description: str
    calories: float
    macros: dict


@router.get("/health")
async def health_check():
    return {"status": "ok", "version": "0.1.0"}


@router.post("/users")
async def create_user(profile: UserProfile, db: AsyncSession = Depends(get_db)):
    user = User(**profile.model_dump())
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"id": user.id, "telegram_id": user.telegram_id}


@router.get("/users/{telegram_id}")
async def get_user(telegram_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "telegram_id": user.telegram_id,
        "username": user.username,
        "age": user.age,
        "weight": user.weight,
        "height": user.height,
        "goal": user.goal
    }


@router.post("/meals")
async def log_meal(meal: MealLog, db: AsyncSession = Depends(get_db)):
    meal_entry = Meal(**meal.model_dump())
    db.add(meal_entry)
    await db.commit()
    await db.refresh(meal_entry)
    return {"id": meal_entry.id, "calories": meal_entry.calories}
```

**Step 4: Create main FastAPI app (app/main.py)**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.db import engine, Base
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="AI Health Architect",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

**Step 5: Run test to verify it passes**

Run: `pytest tests/test_api.py::test_health_check -v`
Expected: PASS

**Step 6: Test API manually**

Run:
```bash
python app/main.py
```

Then in another terminal:
```bash
curl http://localhost:8000/api/health
```

Expected: `{"status":"ok","version":"0.1.0"}`

**Step 7: Commit**

```bash
git add app/api app/main.py tests/test_api.py
git commit -m "feat: add FastAPI backend with health check and user/meal endpoints"
```

---

## Task 5: Telegram Bot (aiogram)

**Files:**
- Create: `app/bot/__init__.py`
- Create: `app/bot/handlers.py`
- Create: `app/bot/bot.py`

**Step 1: Create bot initialization (app/bot/bot.py)**

```python
import asyncio
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from app.core.config import settings
from app.bot.handlers import register_handlers

bot = Bot(
    token=settings.BOT_TOKEN.get_secret_value(),
    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
)
dp = Dispatcher()


async def start_bot():
    register_handlers(dp)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(start_bot())
```

**Step 2: Create bot handlers (app/bot/handlers.py)**

```python
from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import CommandStart, Command
from app.core.ai import ai_client
from app.db import AsyncSessionLocal, User, Meal
from sqlalchemy import select
import io

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(User).where(User.telegram_id == message.from_user.id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            user = User(
                telegram_id=message.from_user.id,
                username=message.from_user.username
            )
            session.add(user)
            await session.commit()
    
    await message.answer(
        f"👋 Привіт, {message.from_user.first_name}!\n\n"
        "Я твій AI Health Architect. Надішли мені фото їжі, і я розрахую калорії!\n\n"
        "Доступні команди:\n"
        "/start - Початок роботи\n"
        "/stats - Твоя статистика"
    )


@router.message(F.photo)
async def handle_photo(message: Message):
    await message.answer("🔍 Аналізую фото...")
    
    photo = message.photo[-1]
    file = await message.bot.get_file(photo.file_id)
    photo_bytes = await message.bot.download_file(file.file_path)
    
    image_data = photo_bytes.read()
    
    result = await ai_client.analyze_food_image(image_data)
    
    async with AsyncSessionLocal() as session:
        meal = Meal(
            user_id=message.from_user.id,
            description=result["description"],
            calories=result["calories"],
            macros=result["macros"]
        )
        session.add(meal)
        await session.commit()
    
    response = (
        f"✅ <b>Аналіз завершено!</b>\n\n"
        f"📝 <b>Опис:</b> {result['description']}\n"
        f"🔥 <b>Калорії:</b> {result['calories']} kcal\n\n"
        f"<b>Макронутрієнти:</b>\n"
        f"🥩 Білки: {result['macros']['protein']}g\n"
        f"🍞 Вуглеводи: {result['macros']['carbs']}g\n"
        f"🥑 Жири: {result['macros']['fat']}g"
    )
    
    await message.answer(response)


@router.message(F.text & ~F.text.startswith("/"))
async def handle_text(message: Message):
    response = await ai_client.chat(message.text)
    await message.answer(response)


def register_handlers(dp):
    dp.include_router(router)
```

**Step 3: Commit**

```bash
git add app/bot
git commit -m "feat: add Telegram bot with photo and chat handlers"
```

---

## Task 6: Frontend (React + Vite)

**Step 1: Initialize Vite project**

Run:
```bash
npx -y create-vite@latest frontend --template react-ts
cd frontend
npm install
```

**Step 2: Install dependencies**

Run:
```bash
npm install axios recharts framer-motion clsx tailwind-merge lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 3: Configure Tailwind (frontend/tailwind.config.js)**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

**Step 4: Create global styles (frontend/src/index.css)**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
```

**Step 5: Create Dashboard component (frontend/src/pages/Dashboard.tsx)**

```typescript
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface MealStats {
  date: string;
  calories: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<MealStats[]>([]);
  
  useEffect(() => {
    // This would be fetched from the API
    setStats([
      { date: '2026-01-20', calories: 1850 },
      { date: '2026-01-21', calories: 2100 },
      { date: '2026-01-22', calories: 1920 },
      { date: '2026-01-23', calories: 2050 },
      { date: '2026-01-24', calories: 1780 },
      { date: '2026-01-25', calories: 2200 },
    ]);
  }, []);
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">
            📊 Your Health Dashboard
          </h1>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <p className="text-sm opacity-80">Today's Calories</p>
              <p className="text-3xl font-bold">2,200</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <p className="text-sm opacity-80">Goal</p>
              <p className="text-3xl font-bold">2,000</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <p className="text-sm opacity-80">Avg Calories</p>
              <p className="text-3xl font-bold">1,983</p>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Weekly Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="calories" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 6: Update App.tsx (frontend/src/App.tsx)**

```typescript
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return <Dashboard />;
}

export default App;
```

**Step 7: Test frontend locally**

Run:
```bash
npm run dev
```

Expected: Dev server starts, you can visit http://localhost:5173 and see the dashboard

**Step 8: Build for production**

Run:
```bash
npm run build
```

Expected: Creates `dist/` directory with optimized files

**Step 9: Commit**

```bash
git add frontend
git commit -m "feat: add React dashboard with Recharts and TailwindCSS"
```

---

## Task 7: Integration - Serve Frontend from FastAPI

**Files:**
- Modify: `app/main.py`

**Step 1: Update app/main.py to serve static files**

Add after CORS middleware:

```python
from fastapi.staticfiles import StaticFiles
import os

# ... existing code ...

# Serve frontend build
if os.path.exists("frontend/dist"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")
    app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")
```

**Step 2: Build frontend**

Run:
```bash
cd frontend && npm run build && cd ..
```

**Step 3: Test integration**

Run:
```bash
python app/main.py
```

Visit: `http://localhost:8000`

Expected: React dashboard loads from FastAPI

**Step 4: Commit**

```bash
git add app/main.py
git commit -m "feat: integrate frontend build with FastAPI static serving"
```

---

## Task 8: Docker Configuration

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `.dockerignore`

**Step 1: Create Dockerfile**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install Node.js for frontend build
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend and build
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Copy backend code
WORKDIR /app
COPY app/ ./app/

# Expose port
EXPOSE 8000

# Run both bot and API
CMD ["sh", "-c", "python -m app.bot.bot & python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"]
```

**Step 2: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  health-architect:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./health.db:/app/health.db
    restart: unless-stopped
```

**Step 3: Create .dockerignore**

```
.git
.venv
__pycache__
*.pyc
node_modules
frontend/dist
.env
*.db
.pytest_cache
.DS_Store
```

**Step 4: Test Docker build**

Run:
```bash
docker-compose build
```

Expected: Image builds successfully

**Step 5: Commit**

```bash
git add Dockerfile docker-compose.yml .dockerignore
git commit -m "feat: add Docker configuration for deployment"
```

---

## Task 9: Documentation

**Files:**
- Create: `README.md`

**Step 1: Create comprehensive README**

```markdown
# 🏋️ AI Health Architect

AI-powered Telegram fitness assistant with calorie tracking and health advice.

## Features

- 📸 **Photo-based calorie tracking** using Gemini AI
- 💬 **Health advice chatbot** 
- 📊 **Interactive dashboard** (Telegram Mini App)
- 🗄️ **SQLite database** for meal/workout logging
- 🐳 **Docker-ready** for easy VPS deployment

## User Review Required

> [!IMPORTANT]
> **AI Provider Selection**: Choose between Gemini or OpenAI
> - **Gemini** (Google): `AI_PROVIDER=gemini` + `GEMINI_API_KEY`
> - **OpenAI** (GPT-4 Vision): `AI_PROVIDER=openai` + `OPENAI_API_KEY`
> 
> Both providers implement the same interface, so you can switch at any time via configuration.

> [!WARNING]
> **API Keys Required**:
> - **Telegram Bot Token**: Create via @BotFather
> - **AI API Key**: Based on your provider choice

## Tech Stack

- **Backend:** FastAPI, aiogram, SQLAlchemy
- **AI:** Google Gemini 1.5/2.0 Flash
- **Frontend:** React, TypeScript, TailwindCSS, Recharts
- **Database:** SQLite (async)

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repo-url>
   cd ai-health-architect
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your tokens
   ```

3. **Run backend:**
   ```bash
   python app/main.py
   ```

4. **Run bot (separate terminal):**
   ```bash
   python -m app.bot.bot
   ```

5. **Develop frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Docker Deployment

```bash
docker-compose up -d
```

## Environment Variables

- `BOT_TOKEN` - Telegram bot token from @BotFather
- `GEMINI_API_KEY` - Google Gemini API key
- `DATABASE_URL` - SQLite connection string

## Development

Run tests:
```bash
pytest -v
```

## License

MIT
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README"
```

**Step 3: Final verification**

Run all tests:
```bash
pytest -v
```

Expected: All tests pass

**Step 4: Tag release**

```bash
git tag -a v0.1.0 -m "Initial release: Core functionality"
git push origin main --tags
```

---

## Execution Complete

**Plan saved to:** `docs/plans/2026-01-25-ai-health-architect.md`

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
