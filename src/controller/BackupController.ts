import dbConnectionString from 'src/lib/helpers/db-connection-string';
import { spawn } from 'child_process';
import { catchAsync } from 'src/lib/functional';
import path from 'path';
import fs from 'fs/promises';

const backupPath = (fileName: string) => `backup/${fileName}.gzip`;

const performBackup = () => {
  const archivePath = backupPath(Date.now().toString());
  return spawn('mongodump', [
    `${dbConnectionString}`,
    `--archive=./${archivePath}`,
    '--gzip',
  ]);
};

const restore = (fileName: string) => {
  const archivePath = backupPath(fileName);
  return spawn('mongorestore', [
    `${dbConnectionString}`,
    `--archive=./${archivePath}`,
    '--gzip',
    '--drop',
  ]);
};

const getExistingBackups = async () => {
  const backupPath = path.join(__dirname, '../../backup/');
  const backups = await fs.readdir(backupPath, 'utf-8');
  return backups;
};

namespace BackupController {
  // TODO: implement controller functions
}
export default BackupController;
