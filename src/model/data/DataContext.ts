import Database from './Database';
import User from './schema/User';
import Activity from './schema/Activity';
import UserRole from '../enum/UserRole';
import users from '../../static/test-data/users';
import activities from '../../static/test-data/activities';
import AppLocale from '../enum/AppLocale';

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
      firstName: process.env.SEED_FIRSTNAME || 'Arystoteles',
      lastName: process.env.SEED_LASTNAME || 'Admin',
      country: process.env.SEED_COUNTRY || 'Ukraine',
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

  private seedTestData() {
    users.forEach(user => {
      const newUser = new User(user);
      newUser
        .save()
        .then(() => {
          console.log(`User ${newUser.email} created`);
        })
        .catch((err: Error) => {
          console.error('Error creating user:', err);
        });
    });
    activities.forEach(activity => {
      const newActivity = new Activity(activity);
      newActivity
        .save()
        .then(() => {
          console.log(
            `Activity ${newActivity.title[AppLocale.English]} created`,
          );
        })
        .catch((err: Error) => {
          console.error('Error creating activity:', err);
        });
    });
  }

  public createSeedUserIfNotExists = () =>
    this.seedUserExists().then(exists => {
      if (exists) {
        console.log('Seed user already exists');
      } else {
        this.createSeedUser();
        this.seedTestData();
      }
    });
}
export default DataContext;
