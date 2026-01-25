import pytest
from app.db.models import User, Meal, Base


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
