import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiService = {
    async getUser(telegram_id: number) {
        const response = await api.get(`/api/users/${telegram_id}`);
        return response.data;
    },

    async logMeal(mealData: any) {
        const response = await api.post('/api/meals', mealData);
        return response.data;
    },

    async getRecentMeals(user_id: number) {
        const response = await api.get(`/api/meals?user_id=${user_id}`);
        return response.data;
    },
};
