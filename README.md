# AI Health Architect 🏥🤖

AI Health Architect is a comprehensive health tracking platform that combines AI-powered food analysis, workout tracking, and health logging into a seamless experience via a Telegram Mini App.

![Dashboard](stitch_dashboard.png)

## 🌟 Key Features

- **📸 AI Food Analysis:** Snap a photo of your meal, and Gemini 2.0 Flash instantly analyzes calories and macros.
- **📱 Telegram Mini App:** Full-featured React app integrated directly into Telegram with a beautiful teal/dark mode UI.
- **📊 Analytics Dashboard:** Visual insights into your daily calorie intake, workout frequency, and health trends.
- **💪 Workout Tracking:** Log exercises and track your fitness journey.
- **🐳 Dockerized:** Ready for deployment with a single command.

## 🛠 Tech Stack

- **Backend:** FastAPI, SQLAlchemy, Google Gemini 2.0 Flash
- **Frontend:** React, TypeScript, TailwindCSS, Recharts
- **Bot:** aiogram 3.x
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **Deployment:** Docker, Docker Compose

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### Running with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd ai-health-architect
   ```

2. **Configure Environment:**
   Create a `.env` file:
   ```bash
   GEMINI_API_KEY=your_gemini_key
   TELEGRAM_BOT_TOKEN=your_bot_token
   DATABASE_URL=sqlite:////app/data/health.db
   ```

3. **Launch:**
   ```bash
   docker-compose up -d --build
   ```

4. **Access:**
   - App: http://localhost:8000
   - Bot: Open your bot in Telegram and send `/start` or `/webapp`

### Local Development

1. **Backend:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Bot:**
   ```bash
   python -m app.bot.bot
   ```

## 🏗 Architecture

The project follows a modular structure:

```
app/
├── bot/          # Telegram bot logic (handlers, keyboards)
├── core/         # Core config & AI integration
├── db/           # Database models & sessions
├── static/       # Compiled React frontend files
└── main.py       # FastAPI application entry point

frontend/
├── src/
│   ├── components/  # Reusable UI components (Teal theme)
│   ├── pages/       # Dashboard, FoodLog, Workouts
│   └── hooks/       # Telegram WebApp SDK hook
```

## 🎨 Design System

We use a custom **Teal/Cyan** palette for a premium, modern feel:
- **Primary:** Deep Teal (`#031716`)
- **Accent:** Bright Teal (`#0C969C`)
- **Cards:** Glassmorphism gradients (`#032F30` → `#0A7075`)

## 📝 License

MIT License. Built with ❤️ by AI Health Architect Team.
