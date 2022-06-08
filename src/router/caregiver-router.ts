import express from 'express';
import CaregiverController from '../controller/CaregiverController';

const router = express.Router();

router.get('/', CaregiverController.getAllCaregivers);
router.get('/:id', CaregiverController.getCaregiver);

export default router;
