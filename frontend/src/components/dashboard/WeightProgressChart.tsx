import React from 'react';

const WeightProgressChart: React.FC = () => {
    return (
        <div className="px-6 py-2 pb-8">
            <div className="glass-card rounded-xl p-5">
                {/* Header with Current Weight Stats */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                        <h3 className="text-white text-base font-bold">Weight Progress</h3>
                        <p className="text-white/40 text-xs mt-1">Last 6 Months</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white text-2xl font-bold">75.5 <span className="text-sm font-normal text-white/50">kg</span></p>
                        <p className="text-emerald-400 text-xs font-medium flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 0.5kg
                            <span className="text-white/30 ml-1">this week</span>
                        </p>
                    </div>
                </div>

                {/* Custom Line Chart Representation with Scale */}
                <div className="flex gap-2 h-40 w-full mt-2">
                    {/* Y-Axis Scale */}
                    <div className="flex flex-col justify-between text-[10px] text-white/30 font-medium py-2">
                        <span>85</span>
                        <span>80</span>
                        <span>75</span>
                        <span>70</span>
                        <span>65</span>
                    </div>

                    {/* Chart Area */}
                    <div className="relative flex-1 h-full">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none z-0">
                            <div className="border-t border-white/5 w-full"></div>
                            <div className="border-t border-white/5 w-full"></div>
                            <div className="border-t border-white/5 w-full border-dashed"></div>
                            <div className="border-t border-white/5 w-full"></div>
                            <div className="border-t border-white/5 w-full"></div>
                        </div>

                        {/* SVG Line & Gradient (Stretches) */}
                        <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: 'rgba(19, 185, 165, 0.3)', stopOpacity: 1 }}></stop>
                                    <stop offset="100%" style={{ stopColor: 'rgba(19, 185, 165, 0)', stopOpacity: 0 }}></stop>
                                </linearGradient>
                            </defs>
                            {/* Area Fill */}
                            <path d="M0,35 Q100,20 200,45 T400,48 L400,100 L0,100 Z" fill="url(#lineGradient)" style={{ vectorEffect: 'non-scaling-stroke' }}></path>
                            {/* Line Stroke - uses non-scaling-stroke to maintain thickness */}
                            <path d="M0,35 Q100,20 200,45 T400,48" fill="none" stroke="#13b9a5" strokeLinecap="round" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                        </svg>

                        {/* Data Points (Absolute HTML Elements to avoid distortion) */}
                        <div className="absolute top-[35%] left-0 -translate-x-1/2 -translate-y-1/2 size-2 bg-primary rounded-full z-20 shadow-[0_0_10px_rgba(19,185,165,0.5)]"></div>
                        <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 size-2 bg-primary rounded-full z-20 shadow-[0_0_10px_rgba(19,185,165,0.5)]"></div>
                        <div className="absolute top-[48%] right-0 translate-x-1/2 -translate-y-1/2 size-4 bg-primary rounded-full z-20 border-2 border-white shadow-[0_0_15px_rgba(19,185,165,0.8)]"></div>

                        {/* X-Axis Labels */}
                        <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-[10px] text-white/30 font-bold px-1">
                            <span>OCT</span>
                            <span>DEC</span>
                            <span>FEB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeightProgressChart;
