import express from 'express';
import OrganizationController from '../controller/OrganizationController';

const router = express.Router();

router.get('/', OrganizationController.getAllOrganizations);
router.post('/', OrganizationController.createOrganization);
router
  .route('/:id')
  .get(OrganizationController.getOrganization)
  .patch(OrganizationController.updateOrganization)
  .delete(OrganizationController.deleteOrganization);

export default router;
