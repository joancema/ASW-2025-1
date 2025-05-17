import { FlashcardView } from '../models/FlashcardView';
import { Flashcard } from '../models/Flashcard';
import { CreateFlashcardViewDTO } from '../models/FlashcardViewDTO';
import { AppDataSource } from '../database/database';

export class FlashcardViewService {
  private flashcardViewRepository = AppDataSource.getRepository(FlashcardView);
  private flashcardRepository = AppDataSource.getRepository(Flashcard);

  async createFlashcardView(data: CreateFlashcardViewDTO): Promise<FlashcardView | null> {
    const flashcard = await this.flashcardRepository.findOne({ where: { id: BigInt(data.flashcard_id) } });
    if (!flashcard) {
      return null; // Or throw an error: Flashcard not found
    }

    const newFlashcardView = this.flashcardViewRepository.create({
      flashcard: flashcard, // Associate with the found flashcard entity
      flashcard_id: BigInt(data.flashcard_id) // Store the ID as well
    });
    return this.flashcardViewRepository.save(newFlashcardView);
  }

  async getViewsForFlashcard(flashcardId: number): Promise<FlashcardView[]> {
    return this.flashcardViewRepository.find({
      where: { flashcard_id: BigInt(flashcardId) },
      relations: ['flashcard'], // Optionally load the flashcard details
    });
  }

  async getAllFlashcardViews(): Promise<FlashcardView[]> {
    return this.flashcardViewRepository.find({ relations: ['flashcard'] });
  }

  async getFlashcardViewById(id: number): Promise<FlashcardView | null> {
    return this.flashcardViewRepository.findOne({ where: { id: BigInt(id) }, relations: ['flashcard'] });
  }

  // Delete might be useful for admin purposes or cleanup
  async deleteFlashcardView(id: number): Promise<boolean> {
    const result = await this.flashcardViewRepository.delete(String(id));
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
} 