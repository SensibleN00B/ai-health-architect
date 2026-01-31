import { useState, useRef } from 'react';
import MealCard from '../components/MealCard';
import { analyzeFood, meals as mealsApi } from '../services/api';

export default function FoodLog() {
    const [meals, setMeals] = useState<any[]>([
        {
            id: 1,
            name: 'Grilled Chicken with Rice',
            time: '1:30 PM',
            calories: 520,
            macros: { protein: 42, carbs: 55, fat: 12 },
        },
        // ... (preserving mock data for now)
    ]);

    const [activeTab, setActiveTab] = useState('today');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);



    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        try {
            const result = await analyzeFood(file);

            // Persist to backend
            const savedMeal = await mealsApi.create({
                user_id: 1, // TODO: Get from auth context
                description: result.description || 'Analyzed Meal',
                calories: result.calories,
                macros: result.macros,
                // photo_url: ... (upload separately or handle in analyze)
            });

            // Add new meal from API result
            const newMeal = {
                id: savedMeal.id,
                name: savedMeal.description,
                time: new Date(savedMeal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                calories: savedMeal.calories,
                macros: savedMeal.macros,
            };

            setMeals([newMeal, ...meals]);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Failed to analyze food photo');
        } finally {
            setIsAnalyzing(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

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

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
            />

            {/* Add Meal Button */}
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="w-full glass-card p-4 mb-6 flex items-center justify-center gap-2 text-teal-500 font-semibold hover:bg-teal-900/40 transition-all teal-glow disabled:opacity-50"
            >
                {isAnalyzing ? (
                    <span>Analyzing...</span>
                ) : (
                    <>
                        <span className="text-2xl">+</span>
                        Add Meal by Photo
                    </>
                )}
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
