export class BookLentEvent {
  constructor(
    public readonly bookId: string,
    public readonly borrowerId: string,
    public readonly lentAt: Date,
  ) {}
} 