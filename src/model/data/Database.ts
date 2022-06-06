import mongoose, { type Connection } from 'mongoose';
import getDbConnectionString from '../../lib/helpers/get-db-connection-string';

class Database {
  private static instance: Database;
  private connection: Connection;

  private constructor(connection: Connection) {
    this.connection = connection;
  }

  public static connect() {
    if (!Database.instance) {
      mongoose.connect(getDbConnectionString()).then(conn => {
        console.log(
          'Database connection established, using:\n',
          conn.connection.name,
        );
      }).catch((err: Error) => {
        console.error('Database connection error:\n', err)
      });
      
      Database.instance = new Database(mongoose.connection);
    }
    return Database.instance.connection;
  }

  public static disconnect() {
    if (Database.instance) {
      Database.instance.connection.close();
    }
  }
}
export default Database;
