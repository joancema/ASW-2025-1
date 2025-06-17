import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookRepository } from '../../domain/repositories/book.repository';
import { BookAggregate } from '../../domain/aggregates/book.aggregate';
import { BookTypeOrmEntity } from '../persistence/typeorm/book.typeorm.entity';
import { Book } from '../../domain/entities/book.entity';

@Injectable()
export class BookRepositoryImpl implements BookRepository {
  constructor(
    @InjectRepository(BookTypeOrmEntity)
    private readonly bookRepository: Repository<BookTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<BookAggregate | null> {
    const entity = await this.bookRepository.findOne({ where: { id } });
    if (!entity) return null;
    
    return this.toDomain(entity);
  }

  async findAll(): Promise<BookAggregate[]> {
    const entities = await this.bookRepository.find();
    return entities.map(entity => this.toDomain(entity));
  }

  async save(bookAggregate: BookAggregate): Promise<void> {
    const entity = this.toEntity(bookAggregate);
    await this.bookRepository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }

  async findByIsbn(isbn: string): Promise<BookAggregate | null> {
    const entity = await this.bookRepository.findOne({ where: { isbn } });
    if (!entity) return null;
    
    return this.toDomain(entity);
  }

  private toDomain(entity: BookTypeOrmEntity): BookAggregate {
    const book = new Book(
      entity.id,
      entity.title,
      entity.author,
      entity.isbn,
      entity.isAvailable,
    );
    return BookAggregate.fromExisting(book);
  }

  private toEntity(aggregate: BookAggregate): BookTypeOrmEntity {
    const entity = new BookTypeOrmEntity();
    entity.id = aggregate.getId();
    entity.title = aggregate.getTitle();
    entity.author = aggregate.getAuthor();
    entity.isbn = aggregate.getIsbn();
    entity.isAvailable = aggregate.getIsAvailable();
    return entity;
  }
} 