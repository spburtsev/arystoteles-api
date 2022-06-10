import express from 'express';
import TipController from '../controller/TipController';

const router = express.Router();

router.get('/', TipController.getAllTips);
router.post('/', TipController.createTip);
router
  .route('/:id')
  .get(TipController.getTip)
  .patch(TipController.updateTip)
  .delete(TipController.deleteTip);

export default router;
