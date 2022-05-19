import { catchAsync } from '../../lib/functional';
import AppError from '../../model/error/AppError';
import { Model } from 'mongoose';
import ExtensionService from '../../controller/service/ExtensionService';

namespace CrudFactory {
  export const deleteOne = <T>(model: Model<T>) =>
    catchAsync(async (req, res, next) => {
      const doc = await model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(204).json({
        status: 'success',
        data: null,
      });
    });

  export const updateOne = <T>(model: Model<T>) =>
    catchAsync(async (req, res, next) => {
      const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    });

  export const createOne = <T>(model: Model<T>) =>
    catchAsync(async (req, res, _next) => {
      const doc = await model.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    });

  export const getOne = <T>(model: Model<T>, popOptions?: string | string[]) =>
    catchAsync(async (req, res, next) => {
      let query: any = model.findById(req.params.id);
      if (popOptions) {
        query = query.populate(popOptions);
      }
      const doc = await query;

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    });

  export const getAll = <T>(model: Model<T>) =>
    catchAsync(async (req, res, _next) => {
      let filter = {};
      if (req.params.id) {
        filter = { tour: req.params.id };
      }

      const ext = new ExtensionService(model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const doc = await ext.dbQuery;

      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc,
        },
      });
    });
}
export default CrudFactory;
