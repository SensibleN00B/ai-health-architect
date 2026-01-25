import { Meal } from '../types';

interface Props {
    meal: Meal;
}

export default function MealCard({ meal }: Props) {
    const totalMacros = meal.macros.protein + meal.macros.carbs + meal.macros.fat;

    return (
        <div className="glass-card p-4 flex gap-4">
            {/* Photo */}
            <div className="w-16 h-16 rounded-full bg-teal-700 overflow-hidden flex-shrink-0">
                {meal.photo_url ? (
                    <img src={meal.photo_url} alt={meal.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-300 text-2xl">🍽️</div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-white font-semibold text-base">{meal.name}</h3>
                        <p className="text-teal-300/70 text-sm">{meal.time}</p>
                    </div>
                    <div className="text-teal-500 font-bold text-lg whitespace-nowrap">
                        {meal.calories} kcal
                    </div>
                </div>

                {/* Macros bars */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-teal-300/70 w-12">Protein</span>
                        <div className="flex-1 h-1.5 bg-teal-900 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${(meal.macros.protein / totalMacros) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-teal-300/70 w-8 text-right">{meal.macros.protein}g</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-teal-300/70 w-12">Carbs</span>
                        <div className="flex-1 h-1.5 bg-teal-900 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-teal-500/70 rounded-full"
                                style={{ width: `${(meal.macros.carbs / totalMacros) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-teal-300/70 w-8 text-right">{meal.macros.carbs}g</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-teal-300/70 w-12">Fat</span>
                        <div className="flex-1 h-1.5 bg-teal-900 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-teal-500/40 rounded-full"
                                style={{ width: `${(meal.macros.fat / totalMacros) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-teal-300/70 w-8 text-right">{meal.macros.fat}g</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
