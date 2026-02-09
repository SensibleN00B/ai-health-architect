import React, { useEffect, useState } from 'react';
import { users, type UserUpdate } from '../services/api';
import { useUser } from '../context/UserContext';

type ProfileFormState = {
  age: number | '';
  weight: number | '';
  height: number | '';
  goal: string;
};

const Profile: React.FC = () => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState<ProfileFormState>({
    age: '',
    weight: '',
    height: '',
    goal: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    setFormData({
      age: user.age ?? '',
      weight: user.weight ?? '',
      height: user.height ?? '',
      goal: user.goal ?? '',
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'goal' ? value : value === '' ? '' : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');
    try {
      const payload: UserUpdate = {
        telegram_id: user.telegram_id,
        age: formData.age === '' ? undefined : formData.age,
        weight: formData.weight === '' ? undefined : formData.weight,
        height: formData.height === '' ? undefined : formData.height,
        goal: formData.goal || undefined,
      };

      const updatedUser = await users.updateProfile(payload);
      if (updatedUser) {
        setUser(updatedUser);
      } else {
        setUser({ ...user, ...payload });
      }
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
        <div
          className={`p-3 rounded mb-4 ${
            message.includes('success')
              ? 'bg-green-500/20 text-green-200'
              : 'bg-red-500/20 text-red-200'
          }`}
        >
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
            value={formData.age}
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
            value={formData.weight}
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
            value={formData.height}
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
            value={formData.goal}
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
