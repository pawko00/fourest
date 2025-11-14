import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { hashPassword } from '../utils/auth';

const userRepository = AppDataSource.getRepository(User);

export const updateProfileValidation = [
  body('username').optional().isLength({ min: 3, max: 30 }).trim(),
  body('theme').optional().isIn(['light', 'dark']),
  body('soundsEnabled').optional().isBoolean(),
];

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, theme, soundsEnabled, avatarUrl } = req.body;

    const user = await userRepository.findOne({
      where: { id: req.userId! },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if username is taken
    if (username && username !== user.username) {
      const existingUser = await userRepository.findOne({
        where: { username },
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      user.username = username;
    }

    if (theme) user.theme = theme;
    if (soundsEnabled !== undefined) user.soundsEnabled = soundsEnabled;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await userRepository.save(user);

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      theme: user.theme,
      soundsEnabled: user.soundsEnabled,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePasswordValidation = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
];

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await userRepository.findOne({
      where: { id: req.userId! },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const bcrypt = require('bcrypt');
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.passwordHash = await hashPassword(newPassword);
    await userRepository.save(user);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.userId! },
      relations: ['stats'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      theme: user.theme,
      soundsEnabled: user.soundsEnabled,
      createdAt: user.createdAt,
      stats: user.stats,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
