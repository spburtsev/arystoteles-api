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
import organizationRouter from './router/organization-router';
import activityRouter from './router/activity-router';
import childRouter from './router/child-router';
import questionRouter from './router/question-router';
import notificationRouter from './router/notification-router';
import screeningRouter from './router/screening-router';
import tipRouter from './router/tip-router';
import dailyActivityRouter from './router/daily-activity-router';
import medicRouter from './router/medic-router';
import journalPostRouter from './router/journal-post-router';
import deviceRouter from './router/device-router';
import AppLocale from './model/enum/AppLocale';
import BackupService from './service/BackupService';
import EmailService from './service/EmailService';
import BackupMethod from './model/enum/BackupMethod';
import Backup from './model/data/schema/Backup';
import { CronJob } from 'cron';

const setupScheduledJobs = () => {
  const backupJob = new CronJob('59 23 * * *', () => {
    console.log('---------------------');
    console.log('Running a mongodump Job');
    const fileName = Date.now().toString();
    const proc = BackupService.dumpBackup(fileName);

    proc.on('exit', async (code, signal) => {
      let msg: string;
      if (code) {
        msg = `Backup process exited with code: ${code} for backup at ${fileName}`;
        console.log(msg);
        await new EmailService(process.env.ADMIN_EMAIL, '').sendFailureReport(
          fileName,
          msg,
        );
      }
      if (signal) {
        msg = `Backup process killed with signal: ${signal} for backup at ${fileName}`;
        console.log(msg);
        await new EmailService(process.env.ADMIN_EMAIL, '').sendFailureReport(
          fileName,
          msg,
        );
      }
      const backup = new Backup({
        fileName,
        method: BackupMethod.Mongodump,
        createdAt: new Date(),
        system: true,
      });
      await backup.save();

      console.log(`Backup '${fileName}' created successfully`);
    });
    console.log('---------------------');
  });
  backupJob.start();
  console.log('Scheduled jobs were set up');
};

namespace App {
  export const create = () => {
    const app = express();

    app.use(helmet());

    if (process.env.NODE_ENV === 'DEV') {
      app.use(morgan('dev'));
    }

    const limiter = rateLimit({
      max: 300,
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
    app.use('/api/v1/organizations', organizationRouter);
    app.use('/api/v1/activities', activityRouter);
    app.use('/api/v1/children', childRouter);
    app.use('/api/v1/questions', questionRouter);
    app.use('/api/v1/notifications', notificationRouter);
    app.use('/api/v1/screenings', screeningRouter);
    app.use('/api/v1/tips', tipRouter);
    app.use('/api/v1/daily-activities', dailyActivityRouter);
    app.use('/api/v1/medics', medicRouter);
    app.use('/api/v1/journal-posts', journalPostRouter);
    app.use('/api/v1/devices', deviceRouter);

    app.all('*', (req, _res, next) => {
      const text =
        req.locale === AppLocale.English
          ? `Route ${req.originalUrl} not found.`
          : `Шлях ${req.originalUrl} не знайдений.`;
      next(new AppError(text, 404));
    });

    app.use(errorMiddleware);
    setupScheduledJobs();
    return app;
  };
}
export default App;
