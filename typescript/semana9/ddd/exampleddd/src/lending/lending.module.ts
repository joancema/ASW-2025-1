import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookTypeOrmEntity } from './infrastructure/persistence/typeorm/book.typeorm.entity';
import { BookRepositoryImpl } from './infrastructure/repositories/book.repository.impl';
import { BookRepository } from './domain/repositories/book.repository';
import { CreateBookUseCase } from './application/use-cases/create-book.use-case';
import { LendingController } from '../presentation/http/lending.controller';

const BOOK_REPOSITORY_TOKEN = 'BookRepository';

@Module({
  imports: [TypeOrmModule.forFeature([BookTypeOrmEntity])],
  controllers: [LendingController],
  providers: [
    {
      provide: BOOK_REPOSITORY_TOKEN,
      useClass: BookRepositoryImpl,
    },
    CreateBookUseCase,
  ],
  exports: [BOOK_REPOSITORY_TOKEN],
})
export class LendingModule {} 