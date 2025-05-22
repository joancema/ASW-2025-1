import { AppDataSource } from '../../data/typeorm/typeorm.config';
import { TodoTypeOrm } from '../../data/typeorm/mappers/todo.mapper';
import { CreateTodoDto, TodoDatasource, TodoEntity, UpdateTodoDto } from '../../domain';

export class TodoTypeOrmDatasourceImpl implements TodoDatasource {
    private repository = AppDataSource.getRepository(TodoTypeOrm);

    constructor() {
        // Asegurarnos de que la conexión esté inicializada
        if (!AppDataSource.isInitialized) {
            AppDataSource.initialize()
                .then(() => {
                    console.log('TypeORM DataSource has been initialized!');
                })
                .catch((error) => {
                    console.error('Error during TypeORM DataSource initialization:', error);
                    throw error;
                });
        }
    }

    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        // Esperar a que la conexión esté inicializada
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const todoTypeOrm = new TodoTypeOrm();
        todoTypeOrm.text = createTodoDto.text;
        
        const todo = await this.repository.save(todoTypeOrm);
        return todo.toDomain();
    }

    async getAll(): Promise<TodoEntity[]> {
        // Esperar a que la conexión esté inicializada
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const todos = await this.repository.find();
        return todos.map(todo => todo.toDomain());
    }

    async findById(id: number): Promise<TodoEntity> {
        // Esperar a que la conexión esté inicializada
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const todo = await this.repository.findOneBy({ id });
        if (!todo) throw `Todo with id ${id} not found`;
        return todo.toDomain();
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        // Esperar a que la conexión esté inicializada
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        await this.findById(updateTodoDto.id);
        
        const todo = await this.repository.findOneBy({ id: updateTodoDto.id });
        if (!todo) throw `Todo with id ${updateTodoDto.id} not found`;

        // Actualizar solo los campos que vienen en values
        Object.assign(todo, updateTodoDto.values);
        
        const updatedTodo = await this.repository.save(todo);
        return updatedTodo.toDomain();
    }

    async deleteById(id: number): Promise<TodoEntity> {
        // Esperar a que la conexión esté inicializada
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const todo = await this.findById(id);
        await this.repository.delete({ id });
        return todo;
    }
} 