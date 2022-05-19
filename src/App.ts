import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import AppError from './model/error/AppError';
import errorMiddleware from './middleware/error-middleware';
import userRouter from './router/user-router';

namespace App {
  export const create = () => {
    const app = express();

    app.use(helmet());

    if (process.env.NODE_ENV === 'DEV') {
      app.use(morgan('dev'));
    }

    const limiter = rateLimit({
      max: 100,
      windowMs: 60 * 60 * 1000,
      message: 'Too many requests from this IP, please try again in an hour!',
    });
    app.use('/api', limiter);
    app.use(express.json({ limit: '10kb' }));
    app.use(mongoSanitize());
    app.use(xss());

    app.use(express.static(`${__dirname}/public`));

    app.use('/api/v1/users', userRouter);

    app.all('*', (req, _res, next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });

    app.use(errorMiddleware);
    return app;
  };
}
export default App;
