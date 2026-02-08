from aiogram import Dispatcher, Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import CommandStart
from app.core.ai import ai_client
from app.db import AsyncSessionLocal, User, Meal, Workout, HealthLog
from sqlalchemy import select

router = Router()
photo_storage: dict[int, bytes] = {}


@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
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
        "Я твій AI Health Architect. Надішли мені фото їжі, тренування або прогресу, "
        "і я все проаналізую!\n\n"
        "Доступні команди:\n"
        "/start - Початок роботи"
    )


@router.message(F.text == "/webapp")
async def cmd_webapp(message: Message) -> None:
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text="🏥 Open Health App",
            web_app=WebAppInfo(url="http://localhost:8000")
        )]
    ])
    
    await message.answer(
        "📱 Click the button below to open your Health Dashboard!",
        reply_markup=keyboard
    )


@router.message(F.photo)
async def handle_photo(message: Message) -> None:
    await message.answer("🔍 Аналізую фото...")
    
    photo = message.photo[-1]
    file = await message.bot.get_file(photo.file_id)
    photo_bytes = await message.bot.download_file(file.file_path)
    image_data = photo_bytes.read()
    
    classification = await ai_client.classify_photo(image_data)
    
    if classification["confidence"] == "low":
        photo_storage[message.from_user.id] = image_data
        
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🍔 Їжа", callback_data="type:food")],
            [InlineKeyboardButton(text="🏃 Тренування", callback_data="type:workout")],
            [InlineKeyboardButton(text="⚖️ Здоров'я", callback_data="type:health")]
        ])
        
        await message.answer(
            f"🤔 Я не зовсім впевнений ({classification['reasoning']})\n\n"
            "Підкажи, що це за фото?",
            reply_markup=keyboard
        )
    else:
        await process_photo(message.from_user.id, image_data, classification["type"], message)


@router.callback_query(F.data.startswith("type:"))
async def handle_type_selection(callback: CallbackQuery) -> None:
    photo_type = callback.data.split(":")[1]
    image_data = photo_storage.get(callback.from_user.id)
    
    if not image_data:
        await callback.answer("Фото не знайдено, спробуй ще раз")
        return
    
    await callback.answer()
    await callback.message.edit_text("✅ Дякую! Обробляю...")
    
    await process_photo(callback.from_user.id, image_data, photo_type, callback.message)
    del photo_storage[callback.from_user.id]


async def process_photo(user_id: int, image_data: bytes, photo_type: str, message: Message) -> None:
    if photo_type == "food":
        result = await ai_client.analyze_food_image(image_data)
        
        async with AsyncSessionLocal() as session:
            meal = Meal(
                user_id=user_id,
                description=result["description"],
                calories=result["calories"],
                macros=result["macros"]
            )
            session.add(meal)
            await session.commit()
        
        response = (
            f"✅ <b>Аналіз їжі завершено!</b>\n\n"
            f"📝 <b>Опис:</b> {result['description']}\n"
            f"🔥 <b>Калорії:</b> {result['calories']} kcal\n\n"
            f"<b>Макронутрієнти:</b>\n"
            f"🥩 Білки: {result['macros']['protein']}g\n"
            f"🍞 Вуглеводи: {result['macros']['carbs']}g\n"
            f"🥑 Жири: {result['macros']['fat']}g"
        )
    
    elif photo_type == "workout":
        async with AsyncSessionLocal() as session:
            workout = Workout(
                user_id=user_id,
                description="Workout from photo",
                duration_minutes=30
            )
            session.add(workout)
            await session.commit()
        
        response = "✅ <b>Тренування зареєстровано!</b>\n\nПродовжуй у тому ж дусі! 💪"
    
    else:
        async with AsyncSessionLocal() as session:
            health_log = HealthLog(
                user_id=user_id,
                category="progress_photo",
                description="Health tracking photo"
            )
            session.add(health_log)
            await session.commit()
        
        response = "✅ <b>Прогрес зафіксовано!</b>\n\nСтавай кращою версією себе! 🌟"
    
    await message.answer(response)


@router.message(F.text & ~F.text.startswith("/"))
async def handle_text(message: Message) -> None:
    response = await ai_client.chat(message.text)
    await message.answer(response)


def register_handlers(dp: Dispatcher) -> None:
    dp.include_router(router)
