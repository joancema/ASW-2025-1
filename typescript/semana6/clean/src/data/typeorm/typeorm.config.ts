import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { TodoTypeOrm } from './mappers/todo.mapper';

config(); // Carga las variables de entorno

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.POSTGRES_URL,
    synchronize: false, // En producción debe ser false
    logging: process.env.NODE_ENV === 'development',
    entities: [TodoTypeOrm], // Usamos directamente la clase del mapper
    migrations: ['src/data/typeorm/migrations/**/*.ts'],
    subscribers: ['src/data/typeorm/subscribers/**/*.ts'],
});

// Para inicializar la conexión
export const initializeTypeORM = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
    } catch (error) {
        console.error('Error during Data Source initialization:', error);
        throw error;
    }
}; 