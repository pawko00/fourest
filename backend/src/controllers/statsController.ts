import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { UserStats } from '../entities/UserStats';
import { FocusSession } from '../entities/FocusSession';
import { AuthRequest } from '../middleware/auth';
import { Between } from 'typeorm';

const statsRepository = AppDataSource.getRepository(UserStats);
const sessionRepository = AppDataSource.getRepository(FocusSession);

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await statsRepository.findOne({
      where: { userId: req.userId! },
    });

    if (!stats) {
      return res.status(404).json({ error: 'Stats not found' });
    }

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

export const getWeeklyStats = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const sessions = await sessionRepository.find({
      where: {
        userId: req.userId!,
        completed: true,
        endedAt: Between(weekAgo, today),
      },
      order: { endedAt: 'ASC' },
    });

    // Group by day
    const dailyData = new Array(7).fill(0).map((_, i) => {
      const date = new Date(weekAgo);
      date.setDate(date.getDate() + i + 1);
      return {
        date: date.toISOString().split('T')[0],
        minutes: 0,
        sessions: 0,
      };
    });

    sessions.forEach((session) => {
      const sessionDate = new Date(session.endedAt!).toISOString().split('T')[0];
      const dayData = dailyData.find((d) => d.date === sessionDate);
      if (dayData) {
        dayData.minutes += session.durationMinutes;
        dayData.sessions++;
      }
    });

    res.json({
      period: 'week',
      data: dailyData,
      total: {
        minutes: sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
        sessions: sessions.length,
      },
    });
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ error: 'Failed to get weekly stats' });
  }
};

export const getMonthlyStats = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const sessions = await sessionRepository.find({
      where: {
        userId: req.userId!,
        completed: true,
        endedAt: Between(monthAgo, today),
      },
      order: { endedAt: 'ASC' },
    });

    // Group by week
    const weeklyData = new Array(4).fill(0).map((_, i) => {
      const weekStart = new Date(monthAgo);
      weekStart.setDate(weekStart.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      return {
        week: i + 1,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        minutes: 0,
        sessions: 0,
      };
    });

    sessions.forEach((session) => {
      const sessionDate = new Date(session.endedAt!);
      const daysSinceStart = Math.floor(
        (sessionDate.getTime() - monthAgo.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weekIndex = Math.min(Math.floor(daysSinceStart / 7), 3);

      if (weeklyData[weekIndex]) {
        weeklyData[weekIndex].minutes += session.durationMinutes;
        weeklyData[weekIndex].sessions++;
      }
    });

    res.json({
      period: 'month',
      data: weeklyData,
      total: {
        minutes: sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
        sessions: sessions.length,
      },
    });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ error: 'Failed to get monthly stats' });
  }
};
