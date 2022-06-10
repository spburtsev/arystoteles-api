import express from 'express';
import QuestionController from '../controller/QuestionController';

const router = express.Router();

router.get('/', QuestionController.getAllQuestions);
router.post('/', QuestionController.createQuestion);
router
  .route('/:id')
  .get(QuestionController.getQuestion)
  .patch(QuestionController.updateQuestion)
  .delete(QuestionController.deleteQuestion);

export default router;
