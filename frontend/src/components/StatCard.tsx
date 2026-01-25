import type { StatCard as StatCardType } from '../types';

interface Props {
    stat: StatCardType;
}

export default function StatCard({ stat }: Props) {
    return (
        <div className="glass-card p-4">
            <div className="text-teal-300 text-sm font-medium mb-1">
                {stat.title}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
            </div>
            {stat.subtext && (
                <div className="text-teal-300/70 text-xs">
                    {stat.subtext}
                </div>
            )}
            {stat.progress !== undefined && (
                <div className="mt-3 h-2 bg-teal-900 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full transition-all"
                        style={{ width: `${stat.progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
