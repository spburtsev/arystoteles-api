import express from 'express';
import UserController from '../controller/UserController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.post('/signup', AuthController.register);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);

router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);

router.use(AuthController.protect);

router.patch('/updateMyPassword', AuthController.updatePassword);
router.get('/me', UserController.getSelf, UserController.getUser);
router.patch(
  '/updateMe',
  UserController.uploadUserPhoto,
  UserController.resizeUserPhoto,
  UserController.updateSelf,
);
router.delete('/deleteMe', UserController.deleteSelf);

router.use(AuthController.restrictTo(UserRole.Seed, UserRole.Admin));

router.route('/').get(UserController.getAllUsers);

router
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

export default router;
