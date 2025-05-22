import { Router } from 'express';
import { TodosController } from './controller';
import { DatasourceConfig, DatasourceType } from '../../infrastructure/datasource/datasource.config';
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.repository.impl';

export class TodoRoutes {
    static get routes(): Router {
        const router = Router();

        // Usar el datasource configurado (por defecto es PRISMA)
        const datasource = DatasourceConfig.getDatasource( DatasourceType.TYPEORM );
        const todoRepository = new TodoRepositoryImpl(datasource);
        const todoController = new TodosController(todoRepository);

        router.get('/', todoController.getTodos);
        router.get('/:id', todoController.getTodoById);
        router.post('/', todoController.createTodo);
        router.put('/:id', todoController.updateTodo);
        router.delete('/:id', todoController.deleteTodo);

        return router;
    }
}

