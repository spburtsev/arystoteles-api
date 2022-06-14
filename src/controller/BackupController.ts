import { Request, Response, NextFunction } from 'express';
import getDbConnectionString, {
  getDbUri,
} from '../lib/helpers/get-db-connection-string';
import { spawn } from 'child_process';
import catchAsync from '../lib/helpers/catch-async';
import BackupMethod from '../model/enum/BackupMethod';
import RestoreMethod from '../model/enum/RestoreMethod';
import path from 'path';
import fs from 'fs/promises';

const backupPath = (fileName: string) => `backup/${fileName}.gzip`;

const dumpBackup = (fileName: string) => {
  const archivePath = backupPath(fileName);
  const uri = getDbConnectionString();
  const proc = spawn('mongodump', [
    `${uri}`,
    `--archive=./${archivePath}`,
    '--gzip',
  ]);

  return proc;
};

const restore = (fileName: string) => {
  const uri = getDbConnectionString();
  const archivePath = backupPath(fileName);
  return spawn('mongorestore', [
    `${uri}`,
    `--archive=./${archivePath}`,
    '--gzip',
    '--drop',
  ]);
};

const readExistingBackups = async () => {
  const backupPath = path.join(__dirname, '../../backup/');
  const backups = await fs.readdir(backupPath, 'utf-8');
  return backups.map(backup => backup.split('.gz')[0]);
};

namespace BackupController {
  export const getAllBackups = catchAsync(async (req, res, next) => {
    const backups = await readExistingBackups();
    res.status(200).json({ backups });
  });

  export const createBackup = (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const fileName = req.body.fileName || Date.now().toString();
    const dumpProcess = dumpBackup(fileName);

    dumpProcess.on('exit', (code, signal) => {
      if (code) {
        return res.status(500).json({
          message: `Backup process exited with code: ${code}`,
        });
      }
      if (signal) {
        return res.status(500).json({
          message: `Backup process killed with signal: ${signal}`,
        });
      }
      return res.status(200).json({
        message: 'Backup created successfully',
      });
    });
  };

  export const restoreFromBackup = (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const restoreProcess = restore(req.params.fileName);
    restoreProcess.on('error', error => {
      return res.status(500).json({
        message: error.message,
      });
    });

    restoreProcess.on('exit', (code, signal) => {
      if (code) {
        return res.status(500).json({
          message: `Restore process exited with code: ${code}`,
        });
      }
      if (signal) {
        return res.status(500).json({
          message: `Restore process killed with signal: ${signal}`,
        });
      }
      return res.status(200).json({
        message: 'Successfully restored the database',
      });
    });
  };
}
export default BackupController;
