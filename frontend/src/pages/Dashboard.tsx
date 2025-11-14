import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, Flame, TreePine } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { sessionsApi } from '../lib/api';
import type { FocusSession } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [recentSessions, setRecentSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentSessions();
  }, []);

  const loadRecentSessions = async () => {
    try {
      const { data } = await sessionsApi.getAll({ limit: 5 });
      setRecentSessions(data.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = user?.stats;

  const statCards = [
    {
      icon: TreePine,
      label: 'Trees Planted',
      value: stats?.treesPlanted || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats?.currentStreak || 0} days`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      icon: Trophy,
      label: 'Total Minutes',
      value: stats?.totalMinutes || 0,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and start a new focus session
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/focus')}
          className="card hover:shadow-xl transition-shadow p-8 text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                Start Focus Session
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Plant a new tree and start focusing
              </p>
            </div>
            <Play className="w-12 h-12 text-primary-600 group-hover:scale-110 transition-transform" />
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8"
        >
          <h3 className="text-xl font-bold mb-4">Your Forest</h3>
          <div className="flex items-center justify-center h-32 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800 rounded-lg">
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(stats?.treesPlanted || 0, 10) }).map((_, i) => (
                <TreePine
                  key={i}
                  className="w-8 h-8 text-green-700 dark:text-green-300"
                  style={{
                    animation: `grow 2s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
              {(stats?.treesPlanted || 0) === 0 && (
                <p className="text-gray-500 dark:text-gray-400">
                  No trees yet. Start a session!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : recentSessions.length === 0 ? (
          <p className="text-gray-500">No sessions yet. Start your first session!</p>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <TreePine className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium">
                      {session.durationMinutes} minute session
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    session.completed
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}
                >
                  {session.completed ? 'Completed' : 'In Progress'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
