import express from 'express';
import OrganizationController from '../controller/OrganizationController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.use(AuthController.protect);
router
  .route('/me')
  .get(OrganizationController.getSelf)
  .patch(OrganizationController.updateSelf)
  .post(OrganizationController.createSelf);
router.route('/me/medics').get(OrganizationController.getSelfMedics);

router.get('/', OrganizationController.getAllOrganizations);

router.route('/:id').get(OrganizationController.getOrganization);

router.use(AuthController.restrictTo(UserRole.Seed, UserRole.Admin));
router.post('/', OrganizationController.createOrganization);
router
  .route('/:id')
  .patch(OrganizationController.updateOrganization)
  .delete(OrganizationController.deleteOrganization);

export default router;
