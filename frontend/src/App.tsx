import { useState } from 'react';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { LayoutDashboard, Utensils, Dumbbell, User, MessageSquare } from 'lucide-react';
import AIChat from './pages/AIChat';
import Dashboard from './pages/Dashboard';
import FoodLog from './pages/FoodLog';
import Workouts from './pages/Workouts';
import './index.css';

function App() {
  const { webApp: _webApp, user: _user } = useTelegramWebApp();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'food' | 'chat' | 'workouts' | 'profile'>('dashboard');

  const pages = {
    dashboard: <Dashboard />,
    food: <FoodLog />,
    chat: <AIChat />,
    workouts: <Workouts />,
    profile: <div className="p-4 text-white text-center mt-20">Profile Coming Soon</div>,
  };

  return (
    <div className="min-h-screen bg-teal-950">
      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {pages[currentPage]}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-teal-900/80 backdrop-blur-xl border-t border-teal-700/30 safe-area-bottom z-50">
        <div className="max-w-md mx-auto px-2 py-2">
          <div className="grid grid-cols-5 items-center">
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
            <NavButton
              active={currentPage === 'chat'}
              onClick={() => setCurrentPage('chat')}
              icon={MessageSquare}
              label="AI Chat"
            />
            <NavButton
              active={currentPage === 'workouts'}
              onClick={() => setCurrentPage('workouts')}
              icon={Dumbbell}
              label="Gym"
            />
            <NavButton
              active={currentPage === 'profile'}
              onClick={() => setCurrentPage('profile')}
              icon={User}
              label="Profile"
            />
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
      className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all ${active ? 'text-teal-400' : 'text-teal-400/50 hover:text-teal-400/80'
        }`}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export default App;
