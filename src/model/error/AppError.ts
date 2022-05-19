import AppErrorStatus from '../enum/AppErrorStatus';

class AppError extends Error {
  statusCode: number;
  status: AppErrorStatus;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')
      ? AppErrorStatus.Fail
      : AppErrorStatus.Error;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
