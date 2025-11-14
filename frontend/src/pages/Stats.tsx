import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Clock } from 'lucide-react';
import { statsApi } from '../lib/api';
import type { StatsData } from '../types';

export default function Stats() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const { data } = period === 'week' 
        ? await statsApi.getWeekly()
        : await statsApi.getMonthly();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Statistics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your productivity over time
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Loading statistics...</p>
        </div>
      ) : stats ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Sessions
                </h3>
              </div>
              <p className="text-3xl font-bold">{stats.total.sessions}</p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="w-5 h-5 text-primary-600" />
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Minutes
                </h3>
              </div>
              <p className="text-3xl font-bold">{stats.total.minutes}</p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average per {period === 'week' ? 'Day' : 'Week'}
                </h3>
              </div>
              <p className="text-3xl font-bold">
                {Math.round(stats.total.minutes / stats.data.length)} min
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Focus Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey={period === 'week' ? 'date' : 'week'}
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) =>
                    period === 'week'
                      ? new Date(value).toLocaleDateString('en-US', { weekday: 'short' })
                      : `Week ${value}`
                  }
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`${value} min`, 'Focus Time']}
                />
                <Bar dataKey="minutes" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Breakdown */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Detailed Breakdown</h3>
            <div className="space-y-2">
              {stats.data.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {period === 'week'
                        ? new Date(item.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })
                        : `Week ${item.week}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.sessions} session{item.sessions !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {item.minutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
}
