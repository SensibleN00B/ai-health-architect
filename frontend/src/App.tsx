import { useState } from 'react';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { LayoutDashboard, Utensils, Dumbbell, Plus, User } from 'lucide-react';
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
      <nav className="fixed bottom-0 left-0 right-0 bg-teal-900/80 backdrop-blur-xl border-t border-teal-700/30 safe-area-bottom z-50">
        <div className="max-w-md mx-auto px-2 pb-2 pt-2">
          <div className="flex justify-between items-end relative">

            {/* Left Side */}
            <div className="flex gap-1 w-full justify-evenly">
              <NavButton
                active={currentPage === 'dashboard'}
                onClick={() => setCurrentPage('dashboard')}
                icon={LayoutDashboard}
                label="Home"
              />
              <NavButton
                active={currentPage === 'food'}
                onClick={() => setCurrentPage('food')}
                icon={Utensils}
                label="Food"
              />
            </div>

            {/* Center FAB */}
            <div className="relative -top-5 mx-2">
              <button
                className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/40 hover:scale-105 active:scale-95 transition-transform"
                onClick={() => alert('Add menu pending implementation')}
              >
                <Plus size={32} strokeWidth={2.5} />
              </button>
            </div>

            {/* Right Side */}
            <div className="flex gap-1 w-full justify-evenly">
              <NavButton
                active={currentPage === 'workouts'}
                onClick={() => setCurrentPage('workouts')}
                icon={Dumbbell}
                label="Gym"
              />
              <NavButton
                active={false}
                onClick={() => alert('Profile pending')}
                icon={User}
                label="Profile"
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Helper Component for Nav Items
function NavButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 min-w-[60px] py-2 rounded-xl transition-all ${active ? 'text-teal-400' : 'text-teal-400/50 hover:text-teal-400/80'
        }`}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export default App;
