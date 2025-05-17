import { Router } from 'express';
import { FlashcardViewController } from '../controllers/FlashcardViewController';

const router = Router();
const flashcardViewController = new FlashcardViewController();

router.post('/', flashcardViewController.createFlashcardView);
router.get('/', flashcardViewController.getAllFlashcardViews); // Route to get all views (admin)
router.get('/flashcard/:flashcardId', flashcardViewController.getViewsForFlashcard);
router.get('/:id', flashcardViewController.getFlashcardViewById);
router.delete('/:id', flashcardViewController.deleteFlashcardView);

export default router; 