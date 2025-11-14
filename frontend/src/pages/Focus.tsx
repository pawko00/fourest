import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TreePine, Play, Pause, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionsApi } from '../lib/api';
import toast from 'react-hot-toast';
import type { FocusSession } from '../types';

export default function Focus() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState<FocusSession | null>(null);
  const [treeGrowth, setTreeGrowth] = useState(0);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          const progress = ((duration * 60 - newTime) / (duration * 60)) * 100;
          setTreeGrowth(progress);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else if (timeLeft === 0 && session) {
      completeSession();
    }
  }, [isRunning, timeLeft]);

  const startSession = async () => {
    try {
      const { data } = await sessionsApi.create({ durationMinutes: duration });
      setSession(data);
      setIsRunning(true);
      setTimeLeft(duration * 60);
      toast.success('Focus session started! Stay focused! 🌱');
    } catch (error) {
      toast.error('Failed to start session');
    }
  };

  const pauseSession = () => {
    setIsRunning(false);
    toast('Session paused');
  };

  const resumeSession = () => {
    setIsRunning(true);
    toast('Session resumed');
  };

  const completeSession = async () => {
    if (!session) return;

    try {
      await sessionsApi.complete(session.id);
      toast.success('🎉 Congratulations! Tree planted successfully!');
      setIsRunning(false);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Failed to complete session');
    }
  };

  const cancelSession = async () => {
    if (!session) return;

    try {
      await sessionsApi.delete(session.id);
      setSession(null);
      setIsRunning(false);
      setTimeLeft(duration * 60);
      setTreeGrowth(0);
      toast('Session cancelled');
    } catch (error) {
      toast.error('Failed to cancel session');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Focus Session</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Plant a tree and stay focused
        </p>
      </div>

      <div className="card">
        {!session ? (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-4">
                How long do you want to focus?
              </label>
              <div className="grid grid-cols-4 gap-4">
                {[15, 25, 45, 60].map((min) => (
                  <button
                    key={min}
                    onClick={() => {
                      setDuration(min);
                      setTimeLeft(min * 60);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      duration === min
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                    }`}
                  >
                    <p className="text-2xl font-bold">{min}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">minutes</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startSession} className="btn-primary w-full py-4 text-lg">
              <Play className="inline w-5 h-5 mr-2" />
              Start Focus Session
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Timer */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-8xl font-bold mb-4"
              >
                {formatTime(timeLeft)}
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400">
                {isRunning ? 'Stay focused...' : 'Paused'}
              </p>
            </div>

            {/* Growing Tree Visualization */}
            <div className="relative h-64 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 rounded-lg overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [-2, 2, -2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <TreePine
                    className="w-32 h-32 text-green-700 dark:text-green-300"
                    style={{
                      transform: `scale(${0.3 + (treeGrowth / 100) * 0.7})`,
                      transition: 'transform 1s ease-in-out',
                    }}
                  />
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
                <motion.div
                  className="h-full bg-primary-600"
                  style={{ width: `${treeGrowth}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {isRunning ? (
                <button onClick={pauseSession} className="btn-secondary flex-1 py-3">
                  <Pause className="inline w-5 h-5 mr-2" />
                  Pause
                </button>
              ) : (
                <button onClick={resumeSession} className="btn-primary flex-1 py-3">
                  <Play className="inline w-5 h-5 mr-2" />
                  Resume
                </button>
              )}
              
              {timeLeft === 0 ? (
                <button onClick={completeSession} className="btn-primary flex-1 py-3">
                  <Check className="inline w-5 h-5 mr-2" />
                  Complete
                </button>
              ) : (
                <button
                  onClick={cancelSession}
                  className="btn-secondary flex-1 py-3 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              ⚠️ Leaving this page will not cancel your session
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
