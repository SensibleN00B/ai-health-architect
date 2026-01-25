import { Workout } from '../types';

interface Props {
    workout: Workout;
}

const activityIcons: Record<string, string> = {
    running: '🏃',
    gym: '💪',
    cycling: '🚴',
    swimming: '🏊',
    yoga: '🧘',
};

export default function WorkoutCard({ workout }: Props) {
    const icon = activityIcons[workout.type.toLowerCase()] || '🏃';

    return (
        <div className="flex gap-4 relative">
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-2xl teal-glow flex-shrink-0">
                    {icon}
                </div>
                <div className="w-px flex-1 bg-teal-700/30 mt-2"></div>
            </div>

            {/* Card content */}
            <div className="glass-card p-4 flex-1 mb-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-white font-semibold text-base capitalize">{workout.type}</h3>
                        <p className="text-teal-300/70 text-sm">
                            {new Date(workout.timestamp).toLocaleString('uk-UA', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: 'numeric',
                                month: 'short'
                            })}
                        </p>
                    </div>
                    <div className="text-teal-500 font-bold text-lg">
                        {workout.duration_minutes} min
                    </div>
                </div>

                <div className="flex gap-4 text-sm mt-3">
                    {workout.calories_burned && (
                        <div className="text-teal-300/70">
                            🔥 {workout.calories_burned} kcal
                        </div>
                    )}
                    {workout.distance && (
                        <div className="text-teal-300/70">
                            📍 {workout.distance} km
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
