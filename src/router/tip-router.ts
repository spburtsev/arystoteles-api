import express from 'express';
import TipController from '../controller/TipController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.use(AuthController.protect);
router.use(AuthController.restrictTo(UserRole.Seed, UserRole.Admin));

router.get('/', TipController.getAllTips);
router.post('/', TipController.createTip);
router
  .route('/:id')
  .get(TipController.getTip)
  .patch(TipController.updateTip)
  .delete(TipController.deleteTip);

export default router;
