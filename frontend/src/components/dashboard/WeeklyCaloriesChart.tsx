import React from 'react';

interface WeeklyCaloriesChartProps {
    history: any[];
}

const WeeklyCaloriesChart: React.FC<WeeklyCaloriesChartProps> = ({ history }) => {
    // Map history to Mon(1) -> Sun(0)
    // UI displays Mon -> Sun.
    // We create an array ordered Mon..Sun
    const chartData = Array(7).fill(0);
    // Find max for scaling
    const maxCals = 2500; // default max or dynamic

    if (history) {
        history.forEach(day => {
            const d = new Date(day.date);
            let dayIndex = d.getDay(); // 0=Sun, 1=Mon
            // Shift so Mon=0, Sun=6
            let arrayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
            chartData[arrayIndex] = day.calories;
        });
    }

    return (
        <div className="px-6 py-2">
            <div className="glass-card rounded-xl p-5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-base font-bold">Weekly Calorie Intake</h3>
                    <span className="text-white/40 text-xs font-medium">Last 7 Days</span>
                </div>
                <div className="flex items-end justify-between h-40 gap-2">
                    {/* Render bars dynamically */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, idx) => {
                        const cals = chartData[idx];
                        const heightPct = Math.min(100, Math.max(5, (cals / maxCals) * 100));
                        const isToday = new Date().getDay() === (idx === 6 ? 0 : idx + 1);

                        return (
                            <div key={label} className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className={`w-full rounded-t-lg transition-all ${isToday ? 'bg-primary shadow-[0_0_15px_rgba(19,185,165,0.4)]' : 'bg-primary/40'}`}
                                    style={{ height: `${heightPct}%` }}
                                ></div>
                                <p className={`${isToday ? 'text-primary' : 'text-white/40'} text-[10px] font-bold uppercase`}>{label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WeeklyCaloriesChart;
