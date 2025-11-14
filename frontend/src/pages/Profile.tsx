import { useState } from 'react';
import { User as UserIcon, Mail, Shield, Palette, Volume2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../lib/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [soundsEnabled, setSoundsEnabled] = useState(user?.soundsEnabled || true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await userApi.updateProfile({ username, soundsEnabled });
      updateUser({ username, soundsEnabled });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsChangingPassword(false);
      toast.success('Password changed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={user?.email}
              className="input"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2">
              <UserIcon className="w-4 h-4" />
              <span>Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              disabled={!isEditing}
              minLength={3}
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2">
              <Volume2 className="w-4 h-4" />
              <span>Sound Effects</span>
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setSoundsEnabled(!soundsEnabled)}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundsEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                } ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    soundsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {soundsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {isEditing && (
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          )}
        </form>
      </div>

      {/* Statistics */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6">Your Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">
              {user?.stats?.treesPlanted || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Trees Planted</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">
              {user?.stats?.totalSessions || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">
              {user?.stats?.currentStreak || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">
              {Math.round((user?.stats?.totalMinutes || 0) / 60)}h
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security</span>
          </h2>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="btn-secondary"
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
