import express from 'express';
import BackupController from '../controller/BackupController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.use(AuthController.protect);
router.use(AuthController.restrictTo(UserRole.Seed, UserRole.Admin));

router.get('/', BackupController.getAllBackups);
router.post('/', BackupController.createBackup);
router.post('/restore/:fileName', BackupController.restoreFromBackup);

export default router;
