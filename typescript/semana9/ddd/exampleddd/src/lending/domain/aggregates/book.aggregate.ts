import { Book } from '../entities/book.entity';
import { BookId } from '../value-objects/book-id.vo';

export class BookAggregate {
  private constructor(private readonly book: Book) {}

  static create(
    id: string,
    title: string,
    author: string,
    isbn: string,
  ): BookAggregate {
    const bookId = new BookId(id);
    const book = new Book(id, title, author, isbn);
    return new BookAggregate(book);
  }

  static fromExisting(book: Book): BookAggregate {
    return new BookAggregate(book);
  }

  getId(): string {
    return this.book.getId();
  }

  getTitle(): string {
    return this.book.getTitle();
  }

  getAuthor(): string {
    return this.book.getAuthor();
  }

  getIsbn(): string {
    return this.book.getIsbn();
  }

  getIsAvailable(): boolean {
    return this.book.getIsAvailable();
  }

  lendBook(): void {
    this.book.lend();
    // Aquí se podrían disparar eventos de dominio
  }

  returnBook(): void {
    this.book.return();
    // Aquí se podrían disparar eventos de dominio
  }

  getBook(): Book {
    return this.book;
  }
} 