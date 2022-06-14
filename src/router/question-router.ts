import express from 'express';
import QuestionController from '../controller/QuestionController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.use(AuthController.protect);
router.use(AuthController.restrictTo(UserRole.Seed, UserRole.Admin));

router.get('/', QuestionController.getAllQuestions);
router.post('/', QuestionController.createQuestion);
router
  .route('/:id')
  .get(QuestionController.getQuestion)
  .patch(QuestionController.updateQuestion)
  .delete(QuestionController.deleteQuestion);

export default router;
