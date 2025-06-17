export class BookId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('BookId cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: BookId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
} 