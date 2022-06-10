import express from 'express';
import ScreeningController from '../controller/ScreeningController';

const router = express.Router();

router.get('/', ScreeningController.getAllScreenings);
router.post('/', ScreeningController.createScreening);
router
  .route('/:id')
  .get(ScreeningController.getScreening)
  .patch(ScreeningController.updateScreening)
  .delete(ScreeningController.deleteScreening);

export default router;
