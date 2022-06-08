import Caregiver from '../model/data/schema/Caregiver';
import CrudFactory from './factory/CrudFactory';

namespace CaregiverController {
  export const getCaregiver = CrudFactory.getOne(Caregiver, 'user');
  export const getAllCaregivers = CrudFactory.getAll(Caregiver);
}
export default CaregiverController;
