import Screening from '../model/data/schema/Screening';
import CrudFactory from './factory/CrudFactory';

namespace ScreeningController {
  export const createScreening = CrudFactory.createOne(Screening);
  export const getScreening = CrudFactory.getOne(Screening);
  export const getAllScreenings = CrudFactory.getAll(Screening);
  export const updateScreening = CrudFactory.updateOne(Screening);
  export const deleteScreening = CrudFactory.deleteOne(Screening);
}
export default ScreeningController;
