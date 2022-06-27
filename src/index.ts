import dotenv from 'dotenv';
import path from 'path';
import DataContext from './model/data/DataContext';
import App from './App';
import http from 'http';
import https from 'https';

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION. Shutting down.');
  console.log(err.name, err.message);
  process.exit(1);
});

const projectDir = path.resolve(__dirname, '../');
const envFile = path.join(projectDir, '.env');
dotenv.config({ path: envFile });

const ctx = new DataContext();
ctx.createSeedUserIfNotExists();

const app = App.create();
const address = process.env.HOST;

http.createServer(app).listen(8080, address);
const httpsServer = https.createServer({}, app).listen(8443, address);

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION. Shutting down.');
  console.log(err.name, err.message);
  httpsServer.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down.');
  httpsServer.close(() => {
    console.log('Process terminated!');
  });
});
