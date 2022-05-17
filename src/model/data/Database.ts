import mongoose, { connect, type Connection } from 'mongoose';
import AdminType from '../enums/AdminType';
import Admin from './schema/Admin';

class Database {
  private static instance: Database;
  private connection: Connection;

  private constructor(connection: Connection) {
    this.connection = connection;
  }

  public static get connection() {
    if (!Database.instance) {
      const db = process.env.DB.replace(
        /<password>/g,
        encodeURIComponent(process.env.DB_PSW),
      ) || '';
      connect(db).then(conn => {
        console.log(
          'Database connection established, using:\n',
          conn.connection.name,
        );
      });
      
      Database.instance = new Database(mongoose.connection);
    }
    return Database.instance.connection;
  }

  public static get db() {
    return Database.connection.db;
  }

  public static adminSeeded() {
    return true;
  }

  public static seedAdmin() {
    const admin = new Admin({
      _id: new mongoose.Types.ObjectId(),
      username: process.env.SEED_USR || 'admin',
      password: process.env.SEED_PSW || 'admin',
      type: AdminType.Seed,
    });
    admin.save().then(() => {
      console.log('Admin seeded');
    }).catch((err: Error) => {
      console.error('Error seeding admin:', err);
    });
  }
}
export default Database;
