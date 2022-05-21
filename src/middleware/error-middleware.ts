import AppError from '../model/error/AppError';
import { Request, Response, NextFunction } from 'express';

const handleDataCastError = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateDataFields = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleDataValidationError = (err: {
  errors: Array<{ message: string }>;
}) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'DEV') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'PROD') {
    let error = { ...err };

    if (error.name === 'CastError') {
      error = handleDataCastError(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateDataFields(error);
    }
    if (error.name === 'ValidationError') {
      error = handleDataValidationError(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJwtError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJwtExpiredError();
    }

    sendErrorProd(error, res);
  }
};
export default errorMiddleware;
