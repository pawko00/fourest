export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  theme: 'light' | 'dark';
  soundsEnabled: boolean;
  createdAt: string;
}

export interface UserStats {
  id: string;
  userId: string;
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  treesPlanted: number;
  lastSessionDate?: string;
  unlockedTrees: string[];
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  treeTypeId?: string;
  durationMinutes: number;
  completed: boolean;
  startedAt: string;
  endedAt?: string;
  notes?: string;
  treeType?: TreeType;
}

export enum TreeRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface TreeType {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  rarity: TreeRarity;
  unlockRequirement: number;
  iconUrl?: string;
  color: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateSessionData {
  durationMinutes: number;
  treeTypeId?: string;
}

export interface StatsData {
  period: 'week' | 'month';
  data: DailyStats[] | WeeklyStats[];
  total: {
    minutes: number;
    sessions: number;
  };
}

export interface DailyStats {
  date: string;
  minutes: number;
  sessions: number;
}

export interface WeeklyStats {
  week: number;
  startDate: string;
  endDate: string;
  minutes: number;
  sessions: number;
}
