import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import sessionRoutes from './routes/sessions';
import statsRoutes from './routes/stats';
import userRoutes from './routes/user';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/user', userRoutes);

// Error handling
app.use(errorHandler);

// Database connection and server start
AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection established');

    // Seed initial tree types if needed
    await seedTreeTypes();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
  });

// Seed tree types
async function seedTreeTypes() {
  const { TreeType, TreeRarity } = await import('./entities/TreeType');
  const treeRepository = AppDataSource.getRepository(TreeType);

  const count = await treeRepository.count();
  if (count > 0) return;

  const treeTypes = [
    {
      name: 'pine',
      displayName: 'Pine Tree',
      description: 'A classic evergreen tree, perfect for beginners',
      rarity: TreeRarity.COMMON,
      unlockRequirement: 0,
      color: '#22c55e',
    },
    {
      name: 'oak',
      displayName: 'Oak Tree',
      description: 'Strong and majestic, symbolizing wisdom',
      rarity: TreeRarity.COMMON,
      unlockRequirement: 5,
      color: '#16a34a',
    },
    {
      name: 'sakura',
      displayName: 'Cherry Blossom',
      description: 'Delicate pink blossoms representing beauty',
      rarity: TreeRarity.UNCOMMON,
      unlockRequirement: 15,
      color: '#ec4899',
    },
    {
      name: 'bamboo',
      displayName: 'Bamboo',
      description: 'Fast-growing and resilient',
      rarity: TreeRarity.UNCOMMON,
      unlockRequirement: 25,
      color: '#059669',
    },
    {
      name: 'maple',
      displayName: 'Maple Tree',
      description: 'Beautiful autumn colors',
      rarity: TreeRarity.RARE,
      unlockRequirement: 50,
      color: '#dc2626',
    },
    {
      name: 'willow',
      displayName: 'Willow Tree',
      description: 'Graceful and serene',
      rarity: TreeRarity.RARE,
      unlockRequirement: 75,
      color: '#65a30d',
    },
    {
      name: 'bonsai',
      displayName: 'Bonsai Tree',
      description: 'Miniature masterpiece of patience',
      rarity: TreeRarity.EPIC,
      unlockRequirement: 100,
      color: '#0891b2',
    },
    {
      name: 'ancient',
      displayName: 'Ancient Tree',
      description: 'Legendary tree of focus mastery',
      rarity: TreeRarity.LEGENDARY,
      unlockRequirement: 200,
      color: '#7c3aed',
    },
  ];

  await treeRepository.save(treeTypes);
  console.log('✅ Tree types seeded successfully');
}

export default app;
