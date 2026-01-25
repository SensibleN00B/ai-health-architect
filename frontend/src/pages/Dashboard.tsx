import { useState, useEffect } from 'react';
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
    ]);

    const [recentMeals] = useState([
        {
            id: 1,
            name: 'Grilled Chicken Salad',
            time: '12:30 PM',
            calories: 450,
            macros: { protein: 35, carbs: 25, fat: 18 },
        },
        {
            id: 2,
            name: 'Oatmeal with Berries',
            time: '8:00 AM',
            calories: 320,
            macros: { protein: 12, carbs: 55, fat: 8 },
        },
        {
            id: 3,
            name: 'Protein Shake',
            time: '4:30 PM',
            calories: 180,
            macros: { protein: 25, carbs: 10, fat: 5 },
        },
    ]);

    return (
        <div className="min-h-screen p-4 pb-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
                <p className="text-teal-300/70">Track your daily progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>

            {/* Chart */}
            <div className="mb-6">
                <CaloriesChart data={chartData} />
            </div>

            {/* Recent Meals */}
            <div>
                <h2 className="text-white font-semibold mb-3">Recent Meals</h2>
                <div className="space-y-3">
                    {recentMeals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </div>
            </div>
        </div>
    );
}
