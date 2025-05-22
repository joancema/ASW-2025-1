import { In } from 'typeorm';
import { Flashcard } from '../models/Flashcard';
import { Category } from '../models/Category';
import { CreateFlashcardDTO, UpdateFlashcardDTO } from '../models/FlashcardDTO';
import { AppDataSource } from '../database/database';

export class FlashcardService {
  private flashcardRepository = AppDataSource.getRepository(Flashcard);
  private categoryRepository = AppDataSource.getRepository(Category);

  async createFlashcard(data: CreateFlashcardDTO): Promise<Flashcard> {
    const newFlashcard = this.flashcardRepository.create({
      question: data.question,
      answer: data.answer,
      image_url: data.image_url,
    });

    if (data.categoryIds && data.categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({ id: In(data.categoryIds) });
      newFlashcard.categories = categories;
    }

    return this.flashcardRepository.save(newFlashcard);
  }

  async getAllFlashcards(): Promise<Flashcard[]> {
    return this.flashcardRepository.find({ relations: ['categories'] });
  }

  async getFlashcardById(id: number): Promise<Flashcard | null> {
    return this.flashcardRepository.findOne({ where: { id: BigInt(id) }, relations: ['categories'] });
  }

  async updateFlashcard(id: number, data: UpdateFlashcardDTO): Promise<Flashcard | null> {
    const flashcard = await this.getFlashcardById(id);
    if (!flashcard) return null;

    this.flashcardRepository.merge(flashcard, {
        question: data.question,
        answer: data.answer,
        image_url: data.image_url,
    });

    if (data.categoryIds) {
      if (data.categoryIds.length > 0) {
        const categories = await this.categoryRepository.findBy({ id: In(data.categoryIds) });
        flashcard.categories = categories;
      } else {
        flashcard.categories = []; // Clear categories if an empty array is provided
      }
    }

    return this.flashcardRepository.save(flashcard);
  }

  async deleteFlashcard(id: number): Promise<boolean> {
    const result = await this.flashcardRepository.delete(String(id));
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
} 