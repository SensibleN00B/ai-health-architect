import { useState } from 'react';
import WorkoutCard from '../components/WorkoutCard';

export default function Workouts() {
    const [workouts] = useState([
        {
            id: 1,
            type: 'running',
            duration_minutes: 45,
            timestamp: new Date().toISOString(),
            calories_burned: 420,
            distance: 6.5,
        },
        {
            id: 2,
            type: 'gym',
            duration_minutes: 60,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            calories_burned: 380,
        },
        {
            id: 3,
            type: 'cycling',
            duration_minutes: 30,
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            calories_burned: 250,
            distance: 12.0,
        },
    ]);

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
                {workouts.map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} />
                ))}
            </div>

            {/* Floating Add Button */}
            <button className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white text-3xl shadow-lg teal-glow hover:scale-110 transition-transform">
                +
            </button>
        </div>
    );
}
