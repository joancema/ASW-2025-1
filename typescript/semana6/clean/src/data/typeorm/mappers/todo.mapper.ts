import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TodoEntity } from '../../../domain/entities/todo.entity';

@Entity('todo')
export class TodoTypeOrm {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    text!: string;

    @Column('timestamp', { nullable: true })
    completedAt: Date | null = null;

    // Método para convertir de TypeORM a Entidad de Dominio
    toDomain(): TodoEntity {
        return TodoEntity.fromObject({
            id: this.id,
            text: this.text,
            completedAt: this.completedAt
        });
    }

    // Método para convertir de Entidad de Dominio a TypeORM
    static fromDomain(todo: TodoEntity): TodoTypeOrm {
        const todoTypeOrm = new TodoTypeOrm();
        todoTypeOrm.id = todo.id;
        todoTypeOrm.text = todo.text;
        todoTypeOrm.completedAt = todo.completedAt || null;
        return todoTypeOrm;
    }
} 