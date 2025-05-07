import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { View } from "./entity/View";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: [User, View],
    migrations: [],
    subscribers: [],
}); 