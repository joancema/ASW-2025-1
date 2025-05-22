import 'reflect-metadata';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { initializeTypeORM } from './data/typeorm/typeorm.config';

(async()=> {
  main();
})();

async function main() {
  // Inicializar TypeORM
  try {
    await initializeTypeORM();
    console.log('Database initialized');
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }

  const server = new Server({
    port: envs.PORT,
    public_path: envs.PUBLIC_PATH,
    routes: AppRoutes.routes,
  });

  server.start();
}