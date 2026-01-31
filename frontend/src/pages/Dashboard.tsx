import React, { useEffect, useState } from 'react';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { stats } from '../services/api';
import StatsGrid from '../components/dashboard/StatsGrid';
import WeeklyCaloriesChart from '../components/dashboard/WeeklyCaloriesChart';
import WeightProgressChart from '../components/dashboard/WeightProgressChart';

const Dashboard: React.FC = () => {
    const { user } = useTelegramWebApp();
    const [dailyStats, setDailyStats] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (user) {
            stats.getUserStats(user.id).then(setDailyStats).catch(console.error);
            stats.getHistory(user.id).then(setHistory).catch(console.error);
        }
    }, [user]);

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-premium group/design-root overflow-x-hidden pb-10 font-display">
            {/* TopAppBar */}
            <div className="flex items-center p-6 pb-2 justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/30">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover w-full h-full"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtf0vo-nFkv8Q8Jga5BVU9PE3nzvNb4O21aQhKzq390VyFvSJuffaAeUkoyLV0hkMB37mB35H4sUn5w4-Y6DrJo6Ng-i4wP59S4oh35ALYmX47oNqpKSy-bSlneGIVN3VIB9kjHuyzkl9eEUeP4cPT1k4EQG8HQajN6-KcPCnIAtjwJjlLAUw92RfT4ND12ADXLwTlRAdDfoMdiFYN9U5rnofbqjKZFzp_rm2QYQpr5ccJkt6_Sk3ZhS660md_6cBo5fJvuJp7fSY")' }}>
                        </div>
                    </div>
                    <div>
                        <p className="text-white/60 text-xs font-medium">Good Morning,</p>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Alex Rivera</h2>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex size-10 cursor-pointer items-center justify-center rounded-xl glass-card text-white">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>calendar_today</span>
                    </button>
                    <button className="flex size-10 cursor-pointer items-center justify-center rounded-xl glass-card text-white">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
                    </button>
                </div>
            </div>

            {/* Components Grid */}
            <StatsGrid stats={dailyStats} />
            <WeeklyCaloriesChart history={history} />
            <WeightProgressChart />


        </div>
    );
};

export default Dashboard;
