import { useState } from 'react';
import StatCard from '../components/StatCard';
import CaloriesChart from '../components/CaloriesChart';
import MealCard from '../components/MealCard';

export default function Dashboard() {
    const [stats] = useState([
        { title: "Today's Calories", value: '1850/2000', progress: 92.5 },
        { title: "Workouts", value: 2, subtext: 'This week' },
        { title: "Weekly Avg", value: '1920', subtext: 'kcal/day' },
    ]);

    const [chartData] = useState([
        { day: 'Mon', calories: 1800 },
        { day: 'Tue', calories: 2100 },
        { day: 'Wed', calories: 1900 },
        { day: 'Thu', calories: 2000 },
        { day: 'Fri', calories: 1750 },
        { day: 'Sat', calories: 2200 },
        { day: 'Sun', calories: 1850 },
  // Mock Data
  const stats = [
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
            progress: undefined // No progress bar needed for weight
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
        <div className="pb-24 pt-4 px-4 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-teal-300/60 text-sm">Track your daily progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Calories takes full width on mobile if needed, or structured differently */}
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

            {/* Weekly Calories Chart */}
            <div className="glass-card p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Weekly Calories</h2>
                <div className="h-48 w-full">
                    <CaloriesChart data={weeklyCalories} />
                </div>
            </div>

            {/* Weight Chart (New) */}
            <div className="glass-card p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Weight Trend</h2>
                <div className="h-32 w-full flex items-end justify-between gap-1 px-2">
                    {/* Simple CSS-only bar chart for weight trend simulation */}
                    {[76.2, 76.0, 75.9, 75.8, 75.8, 75.6, 75.5].map((w, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 w-full">
                            <div className="w-full bg-teal-500/20 rounded-t-sm relative group h-24 flex items-end">
                                <div
                                    style={{ height: `${((w - 74) / 4) * 100}%` }}
                                    className="w-full bg-teal-500 rounded-t-sm transition-all group-hover:bg-teal-400"
                                ></div>
                                {/* Tooltip */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-teal-900 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {w}kg
                                </div>
                            </div>
                            <span className="text-[10px] text-teal-300/40">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Meals */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-white">Recent Meals</h2>
                    <button className="text-teal-400 text-xs font-medium">View All</button>
                </div>
                <div className="space-y-3">
                    <MealCard
                        title="Grilled Chicken Salad"
                        calories={450}
                        time="12:30 PM"
                        macros={{ protein: 35, carbs: 25, fat: 18 }}
                    />
                    <MealCard
                        title="Oatmeal with Berries"
                        calories={320}
                        time="8:00 AM"
                        macros={{ protein: 12, carbs: 45, fat: 6 }}
                    />
                </div>
            </div>
        </div>
    );
}
