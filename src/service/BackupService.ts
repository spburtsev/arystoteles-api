import getDbConnectionString from '../lib/helpers/get-db-connection-string';
import { spawn } from 'child_process';

const backupPath = (fileName: string) => `backup/${fileName}.gzip`;

namespace BackupService {
  export const dumpBackup = (fileName?: string) => {
    const archivePath = backupPath(fileName || Date.now().toString());
    console.log(archivePath);

    const uri = getDbConnectionString();
    return spawn('mongodump', [
      `${uri}`,
      `--archive=./${archivePath}`,
      '--gzip',
    ]);
  };

  export const restore = (fileName: string) => {
    const uri = getDbConnectionString();
    const archivePath = backupPath(fileName);
    return spawn('mongorestore', [
      `${uri}`,
      `--archive=./${archivePath}`,
      '--gzip',
      '--drop',
    ]);
  };
}
export default BackupService;
