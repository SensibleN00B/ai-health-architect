import { useState } from 'react';
import { Plus, Minus, Droplet } from 'lucide-react';

export default function WaterTracker() {
    const [glasses, setGlasses] = useState(3); // Mock initial value
    const target = 8;

    const add = () => setGlasses(p => Math.min(p + 1, target));
    const remove = () => setGlasses(p => Math.max(p - 1, 0));

    return (
        <div className="glass-card p-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Droplet className="text-teal-400 fill-teal-400" size={20} />
                    Hydration
                </h2>
                <span className="text-teal-300 font-medium text-sm">{glasses}/{target} glasses</span>
            </div>

            <div className="flex justify-between items-center bg-teal-900/40 rounded-xl p-2 mb-3">
                {Array.from({ length: target }).map((_, i) => (
                    <div
                        key={i}
                        className={`transition-all duration-300 ${i < glasses
                                ? 'text-teal-400 scale-100 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]'
                                : 'text-teal-800/50 scale-90'
                            }`}
                    >
                        <Droplet
                            size={24}
                            fill={i < glasses ? "currentColor" : "none"}
                            strokeWidth={2.5}
                        />
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={remove}
                    className="flex-1 bg-teal-900/50 hover:bg-teal-900 text-teal-300 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                >
                    <Minus size={16} /> Less
                </button>
                <button
                    onClick={add}
                    className="flex-1 bg-teal-500 hover:bg-teal-400 text-teal-950 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-1 shadow-lg shadow-teal-500/20"
                >
                    <Plus size={16} /> Drink
                </button>
            </div>
        </div>
    );
}
