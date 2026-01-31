import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.DEV ? 'http://localhost:8000/api' : '/api',
});

export const analyzeFood = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/analyze/food', formData);
    return response.data;
};

export const classifyPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/analyze/classify', formData);
    return response.data;
};

export interface Workout {
    id?: number;
    user_id: number;
    description: string;
    duration_minutes?: number;
    intensity?: string;
    activity_type?: string;
    metrics?: Record<string, any>;
    timestamp?: string;
}

export const workouts = {
    create: async (workout: Workout) => {
        const response = await api.post('/workouts', workout);
        return response.data;
    },
    getAll: async (userId: number) => {
        const response = await api.get(`/workouts/${userId}`);
        return response.data;
    }
};

export const meals = {
    create: async (meal: any) => {
        const response = await api.post('/meals', meal);
        return response.data;
    },
    getAll: async (userId: number) => {
        const response = await api.get(`/meals/${userId}`);
        return response.data;
    }
};

export const stats = {
    getUserStats: async (userId: number) => {
        const response = await api.get(`/stats/${userId}`);
        return response.data;
    },
    getHistory: async (userId: number, days: number = 7) => {
        const response = await api.get(`/stats/${userId}/history`, { params: { days } });
        return response.data;
    }
};

export interface User {
    telegram_id: number;
    username?: string;
    id?: number;
    age?: number;
    weight?: number;
    height?: number;
    goal?: string;
}

export const users = {
    sync: async (user: User) => {
        const response = await api.post('/users/sync', user);
        return response.data;
    },
    updateProfile: async (data: Partial<User>) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    }
};

export const health = {
    log: async (entry: any) => {
        const response = await api.post('/health', entry);
        return response.data;
    },
    getHistory: async (userId: number, category?: string) => {
        const params = category ? { category } : {};
        const response = await api.get(`/health/${userId}`, { params });
        return response.data;
    },
    getWeightHistory: async (userId: number, days: number = 30) => {
        const response = await api.get(`/health/history/${userId}`, { params: { days } });
        return response.data;
    }
};
