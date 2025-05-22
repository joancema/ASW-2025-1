import 'reflect-metadata';
import express, { Express } from 'express';
import { AppDataSource, initializeDatabase } from './database/database';
import flashcardRoutes from './routes/flashcardRoutes';
import categoryRoutes from './routes/categoryRoutes';
import flashcardViewRoutes from './routes/flashcardViewRoutes';
// Import routes here when they are created
// import flashcardRoutes from './routes/flashcardRoutes';

export async function initializeApp(): Promise<Express> {
  console.log('Starting application initialization...');
  
  const app = express();
  console.log('Express app created');

  app.use(express.json());
  console.log('Express middleware configured');

  // Register routes
  console.log('Registering routes...');
  app.use('/api/flashcards', flashcardRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/flashcard-views', flashcardViewRoutes);
  console.log('Routes registered successfully');

  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }

  console.log('Application initialization completed');
  return app;
}