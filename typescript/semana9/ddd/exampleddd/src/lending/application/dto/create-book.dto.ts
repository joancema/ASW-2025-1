export class CreateBookDto {
  constructor(
    public readonly title: string,
    public readonly author: string,
    public readonly isbn: string,
  ) {}
} 