import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cors from 'cors';
import AppError from './model/error/AppError';
import errorMiddleware from './middleware/error-middleware';
import localeMiddleware from './middleware/locale-middleware';
import userRouter from './router/user-router';
import backupRouter from './router/backup-router';
import caregiverRouter from './router/caregiver-router';
import organizationRouter from './router/organization-router';
import activityRouter from './router/activity-router';
import childRouter from './router/child-router';
import questionRouter from './router/question-router';
import notificationRouter from './router/notification-router';
import screeningRouter from './router/screening-router';
import tipRouter from './router/tip-router';
import dailyActivityRouter from './router/daily-activity-router';

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
      message: 'Too many requests from this IP, please try again in an hour.',
    });
    app.use('/api', limiter);
    app.use(express.json({ limit: '10kb' }));
    app.use(mongoSanitize());
    app.use(xss());
    app.use(
      cors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      }),
    );

    app.use(express.static(`${__dirname}/../public`));
    app.use(localeMiddleware);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/backups', backupRouter);
    app.use('/api/v1/caregivers', caregiverRouter);
    app.use('/api/v1/organizations', organizationRouter);
    app.use('/api/v1/activities', activityRouter);
    app.use('/api/v1/children', childRouter);
    app.use('/api/v1/questions', questionRouter);
    app.use('/api/v1/notifications', notificationRouter);
    app.use('/api/v1/screenings', screeningRouter);
    app.use('/api/v1/tips', tipRouter);
    app.use('/api/v1/daily-activities', dailyActivityRouter);

    app.all('*', (req, _res, next) => {
      next(new AppError(`Route ${req.originalUrl} not found.`, 404));
    });

    app.use(errorMiddleware);
    return app;
  };
}
export default App;
