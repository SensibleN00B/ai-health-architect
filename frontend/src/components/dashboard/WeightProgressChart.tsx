import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '../../context/UserContext';
import { health } from '../../services/api';

type WeightHistoryItem = {
  date: string;
  weight: number;
};

const WeightProgressChart: React.FC = () => {
  const { user } = useUser();
  const [data, setData] = useState<Array<{ name: string; weight: number; originalDate: string }>>([]);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [weightChange, setWeightChange] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const history = (await health.getWeightHistory(user.id, 30)) as WeightHistoryItem[];

        if (history.length > 0) {
          const formattedData = history.map((item) => ({
            name: new Date(item.date)
              .toLocaleDateString('en-US', { month: 'short' })
              .toUpperCase(),
            weight: item.weight,
            originalDate: item.date,
          }));
          setData(formattedData);

          const latest = history[history.length - 1].weight;
          setCurrentWeight(latest);

          const first = history[0].weight;
          setWeightChange(latest - first);
        }
      } catch (e) {
        console.error('Failed to fetch weight history', e);
      }
    };
    fetchData();
  }, [user?.id]);

  return (
    <div className="px-6 py-2 pb-8">
      <div className="glass-card rounded-xl p-5">
        {/* Header with Current Weight Stats */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <h3 className="text-white text-base font-bold">Weight Progress</h3>
            <p className="text-white/40 text-xs mt-1">Last 30 Days</p>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-bold">
              {currentWeight !== null ? currentWeight : '--'}{' '}
              <span className="text-sm font-normal text-white/50">kg</span>
            </p>
            <p
              className={`${weightChange <= 0 ? 'text-emerald-400' : 'text-red-400'} text-xs font-medium flex items-center justify-end gap-1`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {weightChange <= 0 ? 'arrow_downward' : 'arrow_upward'}
              </span>
              {Math.abs(weightChange).toFixed(1)}kg
              <span className="text-white/30 ml-1">change</span>
            </p>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-40 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#13b9a5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#13b9a5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                hide={false}
                orientation="left"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={20}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  borderRadius: '8px',
                  border: 'none',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#13b9a5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorWeight)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeightProgressChart;
