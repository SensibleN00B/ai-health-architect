import type { StatCard as StatCardType } from '../types';

interface Props {
    stat: StatCardType;
}

export default function StatCard({ stat }: Props) {
    return (
        <div className="glass-card p-3 flex flex-col justify-between h-full min-h-[100px]">
            <div>
                <div className="text-teal-300/80 text-xs font-medium mb-1 truncate">
                    {stat.title}
                </div>
                <div className="flex items-baseline gap-1 truncate">
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
                        {String(stat.value).split('/')[0]}
                    </span>
                    {String(stat.value).includes('/') && (
                        <span className="text-sm sm:text-base text-teal-300/60 font-medium">
                            /{String(stat.value).split('/')[1]}
                        </span>
                    )}
                </div>
            </div>

            <div>
                {stat.subtext && (
                    <div className="text-teal-300/60 text-[10px] sm:text-xs truncate">
                        {stat.subtext}
                    </div>
                )}
                {stat.progress !== undefined && (
                    <div className="mt-2 h-1.5 bg-teal-900/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${stat.progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
