import React, { useState, useEffect } from 'react';
import { users, type User } from '../services/api';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

const Profile: React.FC = () => {
    const { user: telegramUser } = useTelegramWebApp();
    const [formData, setFormData] = useState<Partial<User>>({
        age: 0,
        weight: 0,
        height: 0,
        goal: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Here we could fetch existing profile if we had a getProfile endpoint
        // For now, we assume user knows their data or we start blank/Telegram defaults
        // If we want to pre-fill, we'd need a getProfile endpoint in backend.
        // The plan didn't explicitly add getProfile, so we'll just handle updates.
        // Actually, users.sync returns the user, so we might have it in App state, but App doesn't pass it down.
        // We'll stick to the plan: update profile form.
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'goal' ? value : Number(value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!telegramUser) return;

        setLoading(true);
        setMessage('');
        try {
            await users.updateProfile({
                telegram_id: telegramUser.id,
                ...formData
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 text-white pb-24">
            <h1 className="text-2xl mb-6 font-bold">Edit Profile</h1>

            {message && (
                <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/60">Age</label>
                    <input
                        name="age"
                        type="number"
                        placeholder="Age"
                        onChange={handleChange}
                        className="p-3 rounded-xl bg-white/10 border border-white/10 focus:border-primary outline-none"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/60">Weight (kg)</label>
                    <input
                        name="weight"
                        type="number"
                        step="0.1"
                        placeholder="Weight (kg)"
                        onChange={handleChange}
                        className="p-3 rounded-xl bg-white/10 border border-white/10 focus:border-primary outline-none"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/60">Height (cm)</label>
                    <input
                        name="height"
                        type="number"
                        placeholder="Height (cm)"
                        onChange={handleChange}
                        className="p-3 rounded-xl bg-white/10 border border-white/10 focus:border-primary outline-none"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/60">Goal</label>
                    <input
                        name="goal"
                        type="text"
                        placeholder="e.g. Muscle Gain, Weight Loss"
                        onChange={handleChange}
                        className="p-3 rounded-xl bg-white/10 border border-white/10 focus:border-primary outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 bg-primary text-black font-bold p-3 rounded-xl active:opacity-90 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};
export default Profile;
