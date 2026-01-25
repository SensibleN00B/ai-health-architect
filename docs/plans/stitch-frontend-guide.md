# 🎨 Stitch MCP для Frontend - Implementation Guide

> **Частина плану:** [implementation_plan.md](file:///Users/sensible/.gemini/antigravity/brain/71861ccc-96f5-4f3c-a0c0-e1af8d9f8fc3/implementation_plan.md)

## Що таке Stitch MCP?

Stitch - це AI-powered UI design tool від Google, інтегрований через MCP (Model Context Protocol). Дозволяє генерувати React компоненти та UI screens через текстові промпти.

## Чому Stitch для цього проєкту?

✅ **AI-Generated Design** - створюємо UI через промпти замість ручного кодування  
✅ **React + TypeScript** - експорт в код, який ми використовуємо  
✅ **Швидкий прототайп** - ітерації дизайну через AI  
✅ **Telegram Mini App friendly** - підходить для compact UI  

## Workflow для Task 6 (Frontend)

### Крок 1: Створити Stitch Project

```python
# Використаємо Stitch MCP
from mcp import stitch

project = stitch.create_project(title="AI Health Architect Dashboard")
```

### Крок 2: Згенерувати Screens через Prompts

**Dashboard Screen:**
```
Generate a health dashboard for a Telegram Mini App with:
- Premium glassmorphism design with dark gradient background
- Three stat cards at the top: Today's Calories, Goal, Weekly Average
- Bar chart showing calorie intake for the last 7 days
- Modern, vibrant color palette (blues, purples, greens)
- Smooth animations and micro-interactions
- Mobile-first responsive design
```

**Food Log Screen:**
```
Generate a food log screen showing:
- List of meals with photos (circular thumbnails)
- Each item shows: meal name, calories, macros (protein/carbs/fat)
- Add meal button with gradient background
- Filter by date (today/week/month)
- Clean, card-based layout
```

**Workout Log Screen:**
```
Generate a workout tracking screen with:
- Activity cards showing: type, duration, distance, calories
- Icons for different activity types (running, gym, cycling)
- Timeline view of workouts
- Stats summary at the top
```

### Крок 3: Експорт і Інтеграція

Після генерації:
1. Stitch експортує React components
2. Копіюємо в `frontend/src/components/`
3. Додаємо API integration (axios calls)
4. Підключаємо Telegram WebApp SDK

## Stitch MCP Commands

```bash
# Create project
mcp_stitch_create_project(title="AI Health Architect")

# Generate screen from text
mcp_stitch_generate_screen_from_text(
  project_id="xxx",
  prompt="Dashboard with charts and stats",
  device_type="MOBILE"
)

# Get generated screen
mcp_stitch_get_screen(project_id="xxx", screen_id="yyy")

# List all screens
mcp_stitch_list_screens(project_id="xxx")
```

## Integration з Backend API

**Приклад компонента після Stitch:**

```typescript
// Згенеровано Stitch, додано API інтеграцію
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    // Інтеграція з FastAPI backend
    axios.get('/api/users/123456789/stats')
      .then(res => setStats(res.data));
  }, []);
  
  // Stitch-generated UI code
  return (
    <div className="dashboard">
      {/* Generated design */}
    </div>
  );
}
```

## Переваги підходу

🎨 **Professional Design** - AI генерує premium UI  
⚡ **Швидка розробка** - не пишемо CSS вручну  
🔄 **Легкі ітерації** - змінюємо промпт і регенеруємо  
📱 **Mobile-first** - Telegram Mini App ready  

## Task 6 Updated Workflow

1. **Stitch Generation** (2-3 години)
   - Створити project
   - Згенерувати 3-4 основних screens
   - Переглянути і відкоригувати

2. **Manual Integration** (3-4 години)
   - Експортувати компоненти
   - Додати API calls
   - Telegram WebApp SDK integration
   - Testing

3. **Polish** (1-2 години)
   - Animations (Framer Motion)
   - Edge cases
   - Final testing

**Total: ~8 годин замість 15-20 годин ручного кодування**
