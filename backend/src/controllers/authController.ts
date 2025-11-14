import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { UserStats } from '../entities/UserStats';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { body, validationResult } from 'express-validator';

const userRepository = AppDataSource.getRepository(User);
const statsRepository = AppDataSource.getRepository(UserStats);

export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).trim(),
  body('password').isLength({ min: 6 }),
];

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

    // Check if user exists
    const existingUser = await userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists',
      });
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = userRepository.create({
      email,
      username,
      passwordHash,
    });

    await userRepository.save(user);

    // Create user stats
    const stats = statsRepository.create({
      userId: user.id,
      unlockedTrees: ['pine'], // Default tree
    });
    await statsRepository.save(stats);

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        theme: user.theme,
        soundsEnabled: user.soundsEnabled,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.userId },
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
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
};
