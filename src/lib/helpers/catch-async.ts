import { Request, Response, NextFunction } from 'express';

export type AnyFn = (...args: any[]) => any;
export type ExpressFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => any;
export type CatchAsyncFn = (fn: ExpressFn) => void;

const catchAsync = (fn: ExpressFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
export default catchAsync;
