import { useState, useEffect } from 'react';
import WorkoutCard from '../components/WorkoutCard';
import { workouts } from '../services/api';

export default function Workouts() {
    const [workoutsList, setWorkouts] = useState<any[]>([]);
    const userId = 1; // TODO: Get from auth context

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        try {
            const data = await workouts.getAll(userId);
            setWorkouts(data);
        } catch (error) {
            console.error('Failed to load workouts:', error);
        }
    };

    const handleAddWorkout = async () => {
        // Temporary implementation until UI form exists
        try {
            await workouts.create({
                user_id: userId,
                description: "New Workout",
                duration_minutes: 30,
                intensity: "medium",
                activity_type: "running",
                metrics: { distance: 3.5 }
            });
            loadWorkouts();
        } catch (error) {
            console.error('Failed to create workout:', error);
        }
    };

    return (
        <div className="min-h-screen p-4 pb-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-4">Workouts</h1>
            </div>

            {/* Stats Summary */}
            <div className="glass-card p-4 mb-6">
                <h2 className="text-white font-semibold mb-3">This Week</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <div className="text-teal-300/70 text-sm">Workouts</div>
                        <div className="text-teal-500 text-2xl font-bold">4</div>
                    </div>
                    <div>
                        <div className="text-teal-300/70 text-sm">Total Time</div>
                        <div className="text-teal-500 text-2xl font-bold">3h 20m</div>
                    </div>
                    <div>
                        <div className="text-teal-300/70 text-sm">Calories</div>
                        <div className="text-teal-500 text-2xl font-bold">1,250</div>
                    </div>
                </div>
            </div>

            {/* Workout Timeline */}
            <div>
                {workoutsList.map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} />
                ))}
            </div>

            {/* Floating Add Button */}
            <button
                onClick={handleAddWorkout}
                className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white text-3xl shadow-lg teal-glow hover:scale-110 transition-transform"
            >
                +
            </button>
        </div>
    );
}
