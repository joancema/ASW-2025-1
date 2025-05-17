import { initializeApp } from './app';

const PORT = process.env.PORT || 2500;

async function startServer() {
  try {
    console.log('Starting server initialization...');
    const app = await initializeApp();
    
    return new Promise((resolve, reject) => {
      const server = app.listen(PORT, () => {
        console.log('=================================');
        console.log(`Server is running on port ${PORT}`);
        console.log('=================================');
        console.log('API endpoints available at:');
        console.log(`- http://localhost:${PORT}/api/flashcards`);
        console.log(`- http://localhost:${PORT}/api/categories`);
        console.log(`- http://localhost:${PORT}/api/flashcard-views`);
        console.log('=================================');
        resolve(server);
      });

      server.on('error', (error: Error) => {
        console.error('Server error:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server and handle any errors
console.log('Booting up server...');
startServer()
  .then(() => {
    console.log('Server started successfully');
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  }); 