import { Request, Response } from 'express';
import { FlashcardService } from '../services/FlashcardService';
import { CreateFlashcardDTO, UpdateFlashcardDTO } from '../models/FlashcardDTO';

export class FlashcardController {
  private flashcardService = new FlashcardService();

  createFlashcard = async (req: Request, res: Response): Promise<void> => {
    try {
      const createFlashcardDTO: CreateFlashcardDTO = req.body;
      // Basic validation (can be expanded with a library like Joi or class-validator)
      if (!createFlashcardDTO.question || !createFlashcardDTO.answer) {
        res.status(400).json({ message: 'Question and answer are required' });
        return;
      }
      const newFlashcard = await this.flashcardService.createFlashcard(createFlashcardDTO);
      res.status(201).json(newFlashcard);
    } catch (error) {
      res.status(500).json({ message: 'Error creating flashcard', error: (error as Error).message });
    }
  };

  getAllFlashcards = async (req: Request, res: Response): Promise<void> => {
    try {
      const flashcards = await this.flashcardService.getAllFlashcards();
      res.status(200).json(flashcards);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching flashcards', error: (error as Error).message });
    }
  };

  getFlashcardById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid flashcard ID' });
        return;
      }
      const flashcard = await this.flashcardService.getFlashcardById(id);
      if (flashcard) {
        res.status(200).json(flashcard);
      } else {
        res.status(404).json({ message: 'Flashcard not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching flashcard', error: (error as Error).message });
    }
  };

  updateFlashcard = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid flashcard ID' });
        return;
      }
      const updateFlashcardDTO: UpdateFlashcardDTO = req.body;
      const updatedFlashcard = await this.flashcardService.updateFlashcard(id, updateFlashcardDTO);
      if (updatedFlashcard) {
        res.status(200).json(updatedFlashcard);
      } else {
        res.status(404).json({ message: 'Flashcard not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating flashcard', error: (error as Error).message });
    }
  };

  deleteFlashcard = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid flashcard ID' });
        return;
      }
      const success = await this.flashcardService.deleteFlashcard(id);
      if (success) {
        res.status(204).send(); // No content
      } else {
        res.status(404).json({ message: 'Flashcard not found or could not be deleted' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting flashcard', error: (error as Error).message });
    }
  };
} 