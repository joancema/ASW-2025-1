import { Request, Response } from 'express';
import { FlashcardViewService } from '../services/FlashcardViewService';
import { CreateFlashcardViewDTO } from '../models/FlashcardViewDTO';

export class FlashcardViewController {
  private flashcardViewService = new FlashcardViewService();

  createFlashcardView = async (req: Request, res: Response): Promise<void> => {
    try {
      const createFlashcardViewDTO: CreateFlashcardViewDTO = req.body;
      if (!createFlashcardViewDTO.flashcard_id) {
        res.status(400).json({ message: 'Flashcard ID is required' });
        return;
      }
      const newFlashcardView = await this.flashcardViewService.createFlashcardView(createFlashcardViewDTO);
      if (newFlashcardView) {
        res.status(201).json(newFlashcardView);
      } else {
        res.status(404).json({ message: 'Flashcard not found, cannot create view' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating flashcard view', error: (error as Error).message });
    }
  };

  getViewsForFlashcard = async (req: Request, res: Response): Promise<void> => {
    try {
      const flashcardId = parseInt(req.params.flashcardId);
      if (isNaN(flashcardId)) {
        res.status(400).json({ message: 'Invalid Flashcard ID' });
        return;
      }
      const views = await this.flashcardViewService.getViewsForFlashcard(flashcardId);
      res.status(200).json(views);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching flashcard views', error: (error as Error).message });
    }
  };

  getAllFlashcardViews = async (req: Request, res: Response): Promise<void> => {
    try {
      const views = await this.flashcardViewService.getAllFlashcardViews();
      res.status(200).json(views);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching all flashcard views', error: (error as Error).message });
    }
  };

  getFlashcardViewById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid flashcard view ID' });
        return;
      }
      const view = await this.flashcardViewService.getFlashcardViewById(id);
      if (view) {
        res.status(200).json(view);
      } else {
        res.status(404).json({ message: 'Flashcard view not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching flashcard view', error: (error as Error).message });
    }
  };

  deleteFlashcardView = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
       if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid flashcard view ID' });
        return;
      }
      const success = await this.flashcardViewService.deleteFlashcardView(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Flashcard view not found or could not be deleted' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting flashcard view', error: (error as Error).message });
    }
  };
} 