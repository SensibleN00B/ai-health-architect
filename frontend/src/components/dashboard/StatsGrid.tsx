import React from 'react';

const StatsGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4 p-6">
            {/* Split Daily Calories & Macros Card (Spans 2 columns) */}
            <div className="col-span-2 glass-card rounded-xl p-5 grid grid-cols-2 gap-6 relative overflow-hidden">
                {/* Block 1: Energy (Calories) */}
                <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/60 text-sm font-medium">Energy</p>
                            <p className="text-white text-2xl font-bold mt-1">1,850 <span className="text-sm font-normal text-white/50 block">/ 2,000</span></p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-auto">
                        <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(19,185,165,0.6)]" style={{ width: '92.5%' }}></div>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-primary text-[10px] font-bold uppercase tracking-wider">92.5%</p>
                            <p className="text-white/40 text-[10px]">150 left</p>
                        </div>
                    </div>
                    {/* Decorative Icon Background */}
                    <span className="material-symbols-outlined absolute -right-6 -top-4 text-primary/5 text-[80px] pointer-events-none">local_fire_department</span>
                </div>

                {/* Block 2: Macros */}
                <div className="flex flex-col justify-center border-l border-white/5 pl-6 relative z-10">
                    {/* Protein */}
                    <div className="mb-3">
                        <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-white font-medium">Protein</span>
                            <span className="text-white/60">110/140g</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-purple-400" style={{ width: '78%' }}></div>
                        </div>
                    </div>
                    {/* Carbs */}
                    <div className="mb-3">
                        <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-white font-medium">Carbs</span>
                            <span className="text-white/60">210/250g</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-yellow-400" style={{ width: '84%' }}></div>
                        </div>
                    </div>
                    {/* Fats */}
                    <div>
                        <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-white font-medium">Fats</span>
                            <span className="text-white/60">50/70g</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-rose-400" style={{ width: '71%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workouts Card with Weekly Balance */}
            <div className="glass-card rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <div className="bg-orange-500/20 size-8 flex items-center justify-center rounded-lg">
                        <span className="material-symbols-outlined text-orange-500 text-xl">fitness_center</span>
                    </div>
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">Week</span>
                </div>

                <div>
                    <p className="text-white text-lg font-bold">2 <span className="text-xs font-normal text-white/50">Workouts</span></p>
                </div>

                <div className="mt-1 pt-3 border-t border-white/5 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-white/60">Burned</span>
                        <span className="text-orange-400 font-bold font-mono">2,400</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-white/60">Intake</span>
                        <span className="text-primary font-bold font-mono">14,500</span>
                    </div>
                </div>
            </div>

            {/* Hydration Tracker Card (Replaces Weight Card) */}
            <div className="glass-card rounded-xl p-4 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <div className="bg-blue-400/20 size-8 flex items-center justify-center rounded-lg">
                        <span className="material-symbols-outlined text-blue-400 text-xl">water_drop</span>
                    </div>
                    <button className="bg-blue-500 text-white size-6 rounded flex items-center justify-center hover:bg-blue-600 transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                </div>

                <div className="relative z-10 mt-1">
                    <p className="text-white/60 text-xs font-medium uppercase tracking-tight">Hydration</p>
                    <p className="text-white text-xl font-bold">3 <span className="text-sm font-normal text-white/50">/ 8</span></p>
                </div>

                <div className="flex gap-1 mt-3 relative z-10">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={`h-8 flex-1 rounded-sm ${i < 3 ? 'bg-blue-400' : 'bg-white/10'}`}></div>
                    ))}
                </div>

                {/* Decorative & BG */}
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-blue-500/5 text-[100px] pointer-events-none">water_drop</span>
            </div>
        </div>
    );
};

export default StatsGrid;
