import "reflect-metadata";
import { AppDataSource } from "./data-source";

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connection established");
        return AppDataSource;
    } catch (error) {
        console.error("TypeORM connection error: ", error);
        throw error;
    }
}; 