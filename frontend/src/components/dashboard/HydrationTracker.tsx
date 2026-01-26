import React from 'react';

const HydrationTracker: React.FC = () => {
    return (
        <div className="px-6 py-4">
            <div className="glass-card rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <h3 className="text-white text-base font-bold">Hydration</h3>
                        <p className="text-white/50 text-xs">Target: 8 glasses</p>
                    </div>
                    <button className="bg-primary text-background-dark text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Drink
                    </button>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                    <div className="flex gap-2">
                        {/* Filled drops */}
                        <span className="material-symbols-outlined text-primary fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                        <span className="material-symbols-outlined text-primary fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                        <span className="material-symbols-outlined text-primary fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                        {/* Empty drops */}
                        <span className="material-symbols-outlined text-white/20">water_drop</span>
                        <span className="material-symbols-outlined text-white/20">water_drop</span>
                        <span className="material-symbols-outlined text-white/20">water_drop</span>
                        <span className="material-symbols-outlined text-white/20">water_drop</span>
                        <span className="material-symbols-outlined text-white/20">water_drop</span>
                    </div>
                    <div className="text-right">
                        <span className="text-white text-xl font-bold">3/8</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HydrationTracker;
