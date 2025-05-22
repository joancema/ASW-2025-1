import { TodoDatasource } from '../../domain';
import { TodoDatasourceImpl } from './todo.datasource.impl';
import { TodoTypeOrmDatasourceImpl } from './todo.typeorm.datasource.impl';

export enum DatasourceType {
    PRISMA = 'prisma',
    TYPEORM = 'typeorm'
}

export class DatasourceConfig {
    private static instance: TodoDatasource;

    static getDatasource(type: DatasourceType = DatasourceType.PRISMA): TodoDatasource {
        if (!this.instance) {
            this.instance = this.createDatasource(type);
        }
        return this.instance;
    }

    static setDatasource(type: DatasourceType): void {
        this.instance = this.createDatasource(type);
    }

    private static createDatasource(type: DatasourceType): TodoDatasource {
        switch (type) {
            case DatasourceType.TYPEORM:
                return new TodoTypeOrmDatasourceImpl();
            case DatasourceType.PRISMA:
            default:
                return new TodoDatasourceImpl();
        }
    }
} 