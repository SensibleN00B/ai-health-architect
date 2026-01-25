import { useState } from 'react';
import MealCard from '../components/MealCard';

export default function FoodLog() {
    const [meals] = useState([
        {
            id: 1,
            name: 'Grilled Chicken with Rice',
            time: '1:30 PM',
            calories: 520,
            macros: { protein: 42, carbs: 55, fat: 12 },
        },
        {
            id: 2,
            name: 'Greek Yogurt & Granola',
            time: '8:30 AM',
            calories: 280,
            macros: { protein: 18, carbs: 38, fat: 8 },
        },
        {
            id: 3,
            name: 'Salmon with Vegetables',
            time: '7:00 PM',
            calories: 450,
            macros: { protein: 38, carbs: 20, fat: 24 },
        },
    ]);

    const [activeTab, setActiveTab] = useState('today');

    return (
        <div className="min-h-screen p-4 pb-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-4">Food Log</h1>

                {/* Tabs */}
                <div className="flex gap-2">
                    {['today', 'week', 'month'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${activeTab === tab
                                    ? 'bg-teal-500 text-white'
                                    : 'bg-teal-900/30 text-teal-300 hover:bg-teal-900/50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add Meal Button */}
            <button className="w-full glass-card p-4 mb-6 flex items-center justify-center gap-2 text-teal-500 font-semibold hover:bg-teal-900/40 transition-all teal-glow">
                <span className="text-2xl">+</span>
                Add Meal
            </button>

            {/* Meals List */}
            <div className="space-y-3">
                {meals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                ))}
            </div>
        </div>
    );
}
