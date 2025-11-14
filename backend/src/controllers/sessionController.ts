import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { FocusSession } from '../entities/FocusSession';
import { UserStats } from '../entities/UserStats';
import { TreeType } from '../entities/TreeType';
import { AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const sessionRepository = AppDataSource.getRepository(FocusSession);
const statsRepository = AppDataSource.getRepository(UserStats);
const treeRepository = AppDataSource.getRepository(TreeType);

export const createSessionValidation = [
  body('durationMinutes').isInt({ min: 1, max: 180 }),
  body('treeTypeId').optional().isUUID(),
];

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { durationMinutes, treeTypeId } = req.body;

    // Verify tree type if provided
    if (treeTypeId) {
      const treeType = await treeRepository.findOne({
        where: { id: treeTypeId },
      });
      if (!treeType) {
        return res.status(404).json({ error: 'Tree type not found' });
      }
    }

    const session = sessionRepository.create({
      userId: req.userId!,
      durationMinutes,
      treeTypeId: treeTypeId || null,
      completed: false,
    });

    await sessionRepository.save(session);

    res.status(201).json(session);
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

export const completeSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const session = await sessionRepository.findOne({
      where: { id, userId: req.userId! },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.completed) {
      return res.status(400).json({ error: 'Session already completed' });
    }

    session.completed = true;
    session.endedAt = new Date();
    if (notes) session.notes = notes;

    await sessionRepository.save(session);

    // Update user stats
    await updateUserStats(req.userId!);

    res.json(session);
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
};

export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const [sessions, total] = await sessionRepository.findAndCount({
      where: { userId: req.userId! },
      relations: ['treeType'],
      order: { startedAt: 'DESC' },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json({
      sessions,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const session = await sessionRepository.findOne({
      where: { id, userId: req.userId! },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await sessionRepository.remove(session);

    // Recalculate stats
    await updateUserStats(req.userId!);

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
};

// Helper function to update user stats
async function updateUserStats(userId: string) {
  const stats = await statsRepository.findOne({ where: { userId } });

  if (!stats) return;

  const completedSessions = await sessionRepository.find({
    where: { userId, completed: true },
    order: { endedAt: 'ASC' },
  });

  stats.totalSessions = completedSessions.length;
  stats.totalMinutes = completedSessions.reduce(
    (sum, session) => sum + session.durationMinutes,
    0
  );
  stats.treesPlanted = completedSessions.length;

  // Calculate streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastSession = completedSessions[completedSessions.length - 1];
  const lastSessionDate = lastSession
    ? new Date(lastSession.endedAt!)
    : null;

  if (lastSessionDate) {
    lastSessionDate.setHours(0, 0, 0, 0);

    if (lastSessionDate.getTime() === today.getTime()) {
      // Session today - check if we need to increment streak
      if (!stats.lastSessionDate || 
          new Date(stats.lastSessionDate).getTime() !== today.getTime()) {
        stats.currentStreak++;
      }
    } else if (lastSessionDate.getTime() === yesterday.getTime()) {
      // Session was yesterday, continue streak
      stats.currentStreak++;
    } else {
      // Streak broken
      stats.currentStreak = 1;
    }

    stats.lastSessionDate = lastSessionDate;

    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }
  }

  await statsRepository.save(stats);
}
