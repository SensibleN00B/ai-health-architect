import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { DayCalories } from '../types';

interface Props {
    data: DayCalories[];
}

export default function CaloriesChart({ data }: Props) {
    return (
        <div className="glass-card p-4">
            <h3 className="text-white font-semibold mb-4">Weekly Calories</h3>
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data}>
                    <XAxis
                        dataKey="day"
                        stroke="#6BA3BE"
                        tick={{ fill: '#6BA3BE', fontSize: 12 }}
                    />
                    <YAxis
                        stroke="#6BA3BE"
                        tick={{ fill: '#6BA3BE', fontSize: 12 }}
                    />
                    <Bar dataKey="calories" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#0C969C" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
