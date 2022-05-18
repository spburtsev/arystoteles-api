import { hash } from '../../lib/functional';
import Database from './Database';
import User from './schema/User';
import UserRole from '../enum/UserRole';
import mongoose from 'mongoose';

class DataContext {
  public constructor() {
    Database.connect();
  }

  private async seedUserExists() {
    const user = await User.findOne({ type: UserRole.Seed }).exec();

    return user !== null;
  }

  private createSeedUser() {
    const hashedPassword = hash(process.env.SEED_PSW || 'seed');

    const seed = new User({
      _id: new mongoose.Types.ObjectId(),
      email: process.env.SEED_USR || 'admin@arystoteles.org',
      password: hashedPassword,
      role: UserRole.Seed,
    });
    seed
      .save()
      .then(() => {
        console.log('Seed user created');
      })
      .catch((err: Error) => {
        console.error('Error creating seed user:', err);
      });
  }

  public createSeedUserIfNotExists() {
    const seedUserExists = this.seedUserExists().then(exists => {
      if (exists) {
        console.log('Seed user already exists');
      } else {
        this.createSeedUser();
      }
    });
  }
}
export default DataContext;
