import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatCard from '../components/StatCard';
import type { StatCard as StatCardType } from '../types';
import CaloriesChart from '../components/CaloriesChart';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import WaterTracker from '../components/WaterTracker';

export default function Dashboard() {
    const { user } = useTelegramWebApp();

    // Mock Data
    const stats: StatCardType[] = [
        {
            title: "Today's Calories",
            value: "1850/2000",
            subtext: "150 kcal left",
            progress: 92.5
        },
        {
            title: "Workouts",
            value: "2",
            subtext: "This week"
        },
        {
            title: "Current Weight",
            value: "75.5 kg",
            subtext: "↓ 0.5kg this week",
            progress: undefined
        }
    ];

    const weeklyCalories = [
        { day: "Mon", calories: 1800 },
        { day: "Tue", calories: 2100 },
        { day: "Wed", calories: 1900 },
        { day: "Thu", calories: 2000 },
        { day: "Fri", calories: 1750 },
        { day: "Sat", calories: 2250 },
        { day: "Sun", calories: 1850 },
    ];

    return (
        <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">
                    Hi, {user?.first_name || 'Architect'}!
                </h1>
                <p className="text-teal-300/60 text-sm">Track your daily progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                    <StatCard stat={stats[0]} />
                </div>
                <div className="col-span-1">
                    <StatCard stat={stats[1]} />
                </div>
                <div className="col-span-1">
                    <StatCard stat={stats[2]} />
                </div>
            </div>

            {/* Weekly Calories Chart - Clean Wrapper */}
            <div className="h-48 w-full -mx-2">
                {/* Chart component handles its own layout now, or we wrap it minimally */}
                <CaloriesChart data={weeklyCalories} />
            </div>

            {/* Water Tracker */}
            <WaterTracker />

            {/* Weight Trend Chart */}
            <div className="glass-card p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Weight Progress</h2>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { date: '1 Jan', weight: 76.5 },
                            { date: '5 Jan', weight: 76.2 },
                            { date: '10 Jan', weight: 76.0 },
                            { date: '15 Jan', weight: 75.8 },
                            { date: '20 Jan', weight: 75.6 },
                            { date: '25 Jan', weight: 75.5 },
                        ]}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#115e59" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#5eead4"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                domain={['dataMin - 1', 'dataMax + 1']}
                                hide={true}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#134e4a', borderColor: '#2dd4bf', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#2dd4bf"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorWeight)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
