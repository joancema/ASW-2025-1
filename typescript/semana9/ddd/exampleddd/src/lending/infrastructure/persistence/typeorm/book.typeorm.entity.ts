import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('books')
export class BookTypeOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ default: true })
  isAvailable: boolean;
} 