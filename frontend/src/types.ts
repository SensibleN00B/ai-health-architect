export interface StatCard {
    title: string;
    value: string | number;
    subtext?: string;
    progress?: number;
}

export interface Meal {
    id: number;
    name: string;
    time: string;
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    photo_url?: string;
}

export interface Workout {
    id: number;
    type: string;
    duration_minutes: number;
    timestamp: string;
    calories_burned?: number;
    distance?: number;
}

export interface DayCalories {
    day: string;
    calories: number;
}
