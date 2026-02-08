import { useState } from 'react';
import AIChat from './pages/AIChat';
import Dashboard from './pages/Dashboard';
import FoodLog from './pages/FoodLog';
import Workouts from './pages/Workouts';
import Profile from './pages/Profile';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState<
    'dashboard' | 'food' | 'chat' | 'workouts' | 'profile'
  >('dashboard');

  const pages = {
    dashboard: <Dashboard />,
    food: <FoodLog />,
    chat: <AIChat />,
    workouts: <Workouts />,
    profile: <Profile />,
  };

  return (
    <div className="min-h-screen bg-gradient-premium font-display text-white">
      {/* Main Content */}
      <div className="w-full h-full pb-24">{pages[currentPage]}</div>

      {/* Sticky Bottom Navigation (iOS style) */}
      <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 px-8 py-4 flex justify-between items-center rounded-t-3xl z-50">
        <button
          className={`${currentPage === 'dashboard' ? 'text-primary' : 'text-white/40'}`}
          onClick={() => setCurrentPage('dashboard')}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            grid_view
          </span>
        </button>

        <button
          className={`${currentPage === 'workouts' ? 'text-primary' : 'text-white/40'}`}
          onClick={() => setCurrentPage('workouts')}
        >
          <span className="material-symbols-outlined">fitness_center</span>
        </button>

        <button
          className={`${currentPage === 'food' ? 'text-primary' : 'text-white/40'}`}
          onClick={() => setCurrentPage('food')}
        >
          <span className="material-symbols-outlined">restaurant</span>
        </button>

        <button
          className={`${currentPage === 'chat' ? 'text-primary' : 'text-white/40'}`}
          onClick={() => setCurrentPage('chat')}
        >
          <span className="material-symbols-outlined">mark_chat_unread</span>
        </button>

        <button
          className={`${currentPage === 'profile' ? 'text-primary' : 'text-white/40'}`}
          onClick={() => setCurrentPage('profile')}
        >
          <span className="material-symbols-outlined">person</span>
        </button>
      </div>
    </div>
  );
}

export default App;
