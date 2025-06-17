import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { CreateBookUseCase } from '../../lending/application/use-cases/create-book.use-case';
import { CreateBookDto } from '../../lending/application/dto/create-book.dto';
import { BookRepository } from '../../lending/domain/repositories/book.repository';

@Controller('lending')
export class LendingController {
  constructor(
    private readonly createBookUseCase: CreateBookUseCase,
    @Inject('BookRepository')
    private readonly bookRepository: BookRepository,
  ) {}

  @Post('books')
  @HttpCode(HttpStatus.CREATED)
  async createBook(@Body() createBookDto: CreateBookDto) {
    const bookId = await this.createBookUseCase.execute(createBookDto);
    return { id: bookId, message: 'Book created successfully' };
  }

  @Get('books')
  async getAllBooks() {
    const books = await this.bookRepository.findAll();
    return books.map(book => ({
      id: book.getId(),
      title: book.getTitle(),
      author: book.getAuthor(),
      isbn: book.getIsbn(),
      isAvailable: book.getIsAvailable(),
    }));
  }

  @Get('books/:id')
  async getBookById(@Param('id') id: string) {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return {
      id: book.getId(),
      title: book.getTitle(),
      author: book.getAuthor(),
      isbn: book.getIsbn(),
      isAvailable: book.getIsAvailable(),
    };
  }
} 