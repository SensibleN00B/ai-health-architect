import { useEffect, useRef, useState } from 'react';
import MealCard from '../components/MealCard';
import { analyzeFood, meals as mealsApi } from '../services/api';
import { useUser } from '../context/UserContext';
import type { Meal } from '../types';

type MealResponse = {
  id: number;
  description?: string | null;
  timestamp?: string | null;
  calories?: number | null;
  macros?: { protein?: number; carbs?: number; fat?: number } | null;
  photo_url?: string | null;
};

const toMealCard = (meal: MealResponse): Meal => {
  const macros = meal.macros ?? {};
  return {
    id: meal.id,
    name: meal.description ?? 'Meal',
    time: meal.timestamp
      ? new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    calories: meal.calories ?? 0,
    macros: {
      protein: macros.protein ?? 0,
      carbs: macros.carbs ?? 0,
      fat: macros.fat ?? 0,
    },
    photo_url: meal.photo_url ?? undefined,
  };
};

export default function FoodLog() {
  const { user } = useUser();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeTab, setActiveTab] = useState('today');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) {
      setMeals([]);
      return;
    }

    mealsApi
      .getAll(user.id)
      .then((data: MealResponse[]) => setMeals(data.map(toMealCard)))
      .catch(console.error);
  }, [user?.id]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user?.id) {
      alert('User not ready yet');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeFood(file);

      const savedMeal = await mealsApi.create({
        user_id: user.id,
        description: result.description || 'Analyzed Meal',
        calories: result.calories,
        macros: result.macros,
      });

      const newMeal = toMealCard(savedMeal);
      setMeals((previousMeals) => [newMeal, ...previousMeals]);
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
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                activeTab === tab
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
