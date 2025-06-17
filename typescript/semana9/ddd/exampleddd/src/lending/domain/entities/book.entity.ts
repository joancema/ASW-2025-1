export class Book {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly author: string,
    private readonly isbn: string,
    private isAvailable: boolean = true,
  ) {}

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getAuthor(): string {
    return this.author;
  }

  getIsbn(): string {
    return this.isbn;
  }

  getIsAvailable(): boolean {
    return this.isAvailable;
  }

  lend(): void {
    if (!this.isAvailable) {
      throw new Error('Book is not available for lending');
    }
    this.isAvailable = false;
  }

  return(): void {
    if (this.isAvailable) {
      throw new Error('Book is already available');
    }
    this.isAvailable = true;
  }
} 