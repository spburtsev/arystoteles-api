import dotenv from 'dotenv';
import path from 'path';
import DataContext from './model/data/DataContext';
import App from './App';

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const projectDir = path.resolve(__dirname, '../');
const envFile = path.join(projectDir, '.env');
dotenv.config({ path: envFile });

const ctx = new DataContext();
ctx.createSeedUserIfNotExists();

const port = process.env.APP_PORT || 3000;
const app = App.create();
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
