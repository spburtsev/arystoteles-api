import { Request, Response, NextFunction } from 'express';

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

export const splitAndJoin = (value: string) => value.split(',').join(' ');

export const parseExtension = (value: unknown) => {
  if (typeof value === 'string') {
    return splitAndJoin(value);
  }
  return '';
};
