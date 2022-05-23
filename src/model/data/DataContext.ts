import Database from './Database';
import User from './schema/User';
import UserRole from '../enum/UserRole';

class DataContext {
  public constructor() {
    Database.connect();
  }

  private async seedUserExists() {
    const user = await User.findOne({ type: UserRole.Seed }).exec();
    return user !== null;
  }

  private createSeedUser() {
    const seed = new User({
      email: process.env.SEED_USR || 'admin@arystoteles.org',
      password: process.env.SEED_PSW || 'admin',
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
    this.seedUserExists().then(exists => {
      if (exists) {
        console.log('Seed user already exists');
      } else {
        this.createSeedUser();
      }
    });
  }
}
export default DataContext;
