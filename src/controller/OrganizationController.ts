import Organization from '../model/data/schema/Organization';
import CrudFactory from './factory/CrudFactory';

namespace OrganizationController {
  export const createOrganization = CrudFactory.createOne(Organization);
  export const getOrganization = CrudFactory.getOne(Organization);
  export const getAllOrganizations = CrudFactory.getAll(Organization);
  export const updateOrganization = CrudFactory.updateOne(Organization);
  export const deleteOrganization = CrudFactory.deleteOne(Organization);
}
export default OrganizationController;
