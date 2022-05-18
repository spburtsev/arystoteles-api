import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import DataContext from './model/data/DataContext';
import userRouter from './router/user-router';

const projectDir = path.resolve(__dirname, '../');
const publicDir = path.join(projectDir, 'public');
const envFile = path.join(projectDir, '.env');
dotenv.config({ path: envFile });

const ctx = new DataContext();
ctx.createSeedUserIfNotExists();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(publicDir));

app.use('/api/v1/users', userRouter);

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
