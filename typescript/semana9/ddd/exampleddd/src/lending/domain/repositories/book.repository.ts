import { BookAggregate } from '../aggregates/book.aggregate';

export interface BookRepository {
  findById(id: string): Promise<BookAggregate | null>;
  findAll(): Promise<BookAggregate[]>;
  save(book: BookAggregate): Promise<void>;
  delete(id: string): Promise<void>;
  findByIsbn(isbn: string): Promise<BookAggregate | null>;
} 