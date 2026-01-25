import { useState } from 'react';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import Dashboard from './pages/Dashboard';
import FoodLog from './pages/FoodLog';
import Workouts from './pages/Workouts';
import './index.css';

function App() {
  const { webApp: _webApp, user: _user } = useTelegramWebApp();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'food' | 'workouts'>('dashboard');

  const pages = {
    dashboard: <Dashboard />,
    food: <FoodLog />,
    workouts: <Workouts />,
  };

  return (
    <div className="min-h-screen bg-teal-950">
      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {pages[currentPage]}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-teal-900/80 backdrop-blur-xl border-t border-teal-700/30">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${currentPage === 'dashboard'
              ? 'text-teal-500'
              : 'text-teal-300/60 hover:text-teal-300'
              }`}
          >
            <span className="text-2xl">📊</span>
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentPage('food')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${currentPage === 'food'
              ? 'text-teal-500'
              : 'text-teal-300/60 hover:text-teal-300'
              }`}
          >
            <span className="text-2xl">🍽️</span>
            <span className="text-xs font-medium">Food</span>
          </button>

          <button
            onClick={() => setCurrentPage('workouts')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${currentPage === 'workouts'
              ? 'text-teal-500'
              : 'text-teal-300/60 hover:text-teal-300'
              }`}
          >
            <span className="text-2xl">💪</span>
            <span className="text-xs font-medium">Workouts</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
