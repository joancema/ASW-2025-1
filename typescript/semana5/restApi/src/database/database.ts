import { DataSource } from 'typeorm';
import { Flashcard } from '../models/Flashcard';
import { Category } from '../models/Category';
import { FlashcardView } from '../models/FlashcardView';

console.log('Initializing database configuration...');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db.mvkqxfphaxxypjmcvyuu.supabase.co', // e.g., db.your-project-id.supabase.co
  port: 5432,
  username: 'postgres', // usually 'postgres'
  password: 'Jacm.653349',
  database: 'postgres', // usually 'postgres'
  entities: [Flashcard, Category, FlashcardView],
  synchronize: false, // Enable this for development to automatically create tables
  logging: true, // Enable logging to see SQL queries
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

export async function initializeDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      console.log('Attempting to connect to database...');
      await AppDataSource.initialize();
      console.log('Database connection established successfully');
    } else {
      console.log('Database connection already initialized');
    }
    return true;
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}

console.log('Database configuration completed'); 