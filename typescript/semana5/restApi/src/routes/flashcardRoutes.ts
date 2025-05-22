import { Router } from 'express';
import { FlashcardController } from '../controllers/FlashcardController';

const router = Router();
const flashcardController = new FlashcardController();

router.post('/', flashcardController.createFlashcard);
router.get('/', flashcardController.getAllFlashcards);
router.get('/:id', flashcardController.getFlashcardById);
router.put('/:id', flashcardController.updateFlashcard);
router.delete('/:id', flashcardController.deleteFlashcard);

export default router; 