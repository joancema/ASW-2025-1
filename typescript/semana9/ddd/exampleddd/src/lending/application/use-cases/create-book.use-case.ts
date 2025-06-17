import { Injectable, Inject } from '@nestjs/common';
import { BookRepository } from '../../domain/repositories/book.repository';
import { BookAggregate } from '../../domain/aggregates/book.aggregate';
import { CreateBookDto } from '../dto/create-book.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateBookUseCase {
  constructor(
    @Inject('BookRepository')
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(createBookDto: CreateBookDto): Promise<string> {
    const { title, author, isbn } = createBookDto;
    
    // Verificar si ya existe un libro con el mismo ISBN
    const existingBook = await this.bookRepository.findByIsbn(isbn);
    if (existingBook) {
      throw new Error('A book with this ISBN already exists');
    }

    // Crear el agregado
    const bookId = uuidv4();
    const bookAggregate = BookAggregate.create(bookId, title, author, isbn);

    // Persistir el libro
    await this.bookRepository.save(bookAggregate);

    return bookId;
  }
} 