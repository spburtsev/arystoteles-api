import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export type AnyFn = (...args: any[]) => any;
export type ExpressFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => any;
export type CatchAsyncFn = (fn: ExpressFn) => void;

export const catchAsync = (fn: ExpressFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const hash = (value: string) => {
  return crypto
    .createHash('sha256')
    .update(value)
    .digest('hex');
};
