import { useEffect, useState } from 'react';
import WorkoutCard from '../components/WorkoutCard';
import { workouts as workoutsApi, type Workout as WorkoutApi } from '../services/api';
import { useUser } from '../context/UserContext';
import type { Workout } from '../types';

type WorkoutResponse = WorkoutApi & {
  id: number;
  timestamp?: string;
  metrics?: Record<string, unknown> | null;
};

const toWorkoutCard = (workout: WorkoutResponse): Workout => {
  const metrics = workout.metrics ?? {};
  const calories = metrics['calories_burned'];
  const distance = metrics['distance'];

  return {
    id: workout.id,
    type: workout.activity_type ?? workout.description ?? 'workout',
    duration_minutes: workout.duration_minutes ?? 0,
    timestamp: workout.timestamp ?? new Date().toISOString(),
    calories_burned: typeof calories === 'number' ? calories : undefined,
    distance: typeof distance === 'number' ? distance : undefined,
  };
};

export default function Workouts() {
  const { user } = useUser();
  const [workoutsList, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setWorkouts([]);
      return;
    }

    loadWorkouts(user.id);
  }, [user?.id]);

  const loadWorkouts = async (userId: number) => {
    try {
      const data = (await workoutsApi.getAll(userId)) as WorkoutResponse[];
      setWorkouts(data.map(toWorkoutCard));
    } catch (error) {
      console.error('Failed to load workouts:', error);
    }
  };

  const handleAddWorkout = async () => {
    if (!user?.id) {
      alert('User not ready yet');
      return;
    }

    try {
      await workoutsApi.create({
        user_id: user.id,
        description: 'New Workout',
        duration_minutes: 30,
        intensity: 'medium',
        activity_type: 'running',
        metrics: { distance: 3.5 },
      });
      loadWorkouts(user.id);
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
