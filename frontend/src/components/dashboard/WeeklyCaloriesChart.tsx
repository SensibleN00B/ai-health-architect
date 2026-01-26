import React from 'react';

const WeeklyCaloriesChart: React.FC = () => {
    return (
        <div className="px-6 py-2">
            <div className="glass-card rounded-xl p-5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-base font-bold">Weekly Calorie Intake</h3>
                    <span className="text-white/40 text-xs font-medium">Last 7 Days</span>
                </div>
                <div className="flex items-end justify-between h-40 gap-2">
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full bg-primary/40 rounded-t-lg transition-all" style={{ height: '65%' }}></div>
                        <p className="text-white/40 text-[10px] font-bold uppercase">Mon</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full bg-primary/40 rounded-t-lg transition-all" style={{ height: '85%' }}></div>
                        <p className="text-white/40 text-[10px] font-bold uppercase">Tue</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full bg-primary/40 rounded-t-lg transition-all" style={{ height: '55%' }}></div>
                        <p className="text-white/40 text-[10px] font-bold uppercase">Wed</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full bg-primary/40 rounded-t-lg transition-all" style={{ height: '90%' }}></div>
                        <p className="text-white/40 text-[10px] font-bold uppercase">Thu</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full bg-primary/40 rounded-t-lg transition-all" style={{ height: '45%' }}></div>
                        <p className="text-white/40 text-[10px] font-bold uppercase">Fri</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full bg-primary/40 rounded-t-lg transition-all" style={{ height: '30%' }}></div>
                        <p className="text-white/40 text-[10px] font-bold uppercase">Sat</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full bg-primary shadow-[0_0_15px_rgba(19,185,165,0.4)] rounded-t-lg transition-all" style={{ height: '92%' }}></div>
                        <p className="text-primary text-[10px] font-bold uppercase">Sun</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyCaloriesChart;
