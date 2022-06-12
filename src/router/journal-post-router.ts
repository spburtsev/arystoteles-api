import express from 'express';
import JournalPostController from '../controller/JournalPostController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.use(AuthController.protect);

router.post('/', JournalPostController.addJournalPost);
router.get('/', JournalPostController.getAllJournalPosts);
router
  .route('/:id')
  .get(JournalPostController.getJournalPost)
  .patch(JournalPostController.updateJournalPost)
  .delete(JournalPostController.deleteJournalPost);

export default router;
