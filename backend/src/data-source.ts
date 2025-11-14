import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entities/User';
import { FocusSession } from './entities/FocusSession';
import { UserStats } from './entities/UserStats';
import { TreeType } from './entities/TreeType';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'focusforest',
  password: process.env.DB_PASSWORD || 'focusforest123',
  database: process.env.DB_DATABASE || 'focusforest',
  synchronize: process.env.NODE_ENV === 'development', // Only in dev!
  logging: process.env.NODE_ENV === 'development',
  entities: [User, FocusSession, UserStats, TreeType],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
