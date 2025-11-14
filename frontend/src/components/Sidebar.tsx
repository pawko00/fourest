import { NavLink } from 'react-router-dom';
import { Home, Target, BarChart3, User, TreeDeciduous } from 'lucide-react';

const links = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/focus', icon: Target, label: 'Focus Session' },
  { to: '/stats', icon: BarChart3, label: 'Statistics' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <TreeDeciduous className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-primary-600">FocusForest</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          © 2024 FocusForest
        </p>
      </div>
    </aside>
  );
}
