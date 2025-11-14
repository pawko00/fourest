import { Moon, Sun, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../lib/api';

export default function Navbar() {
  const { user, logout, updateUser } = useAuthStore();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      await userApi.updateProfile({ theme: newTheme });
      updateUser({ theme: newTheme });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user?.username}!
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ready to grow your productivity forest?
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
