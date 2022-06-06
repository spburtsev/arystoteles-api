import { Request, Response, NextFunction } from 'express';
import dbConnectionString from 'src/lib/helpers/db-connection-string';
import { spawn } from 'child_process';
import { catchAsync } from 'src/lib/functional';
import path from 'path';
import fs from 'fs/promises';

const backupPath = (fileName: string) => `backup/${fileName}.gzip`;

const dumpBackup = () => {
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

const readExistingBackups = async () => {
  const backupPath = path.join(__dirname, '../../backup/');
  const backups = await fs.readdir(backupPath, 'utf-8');
  return backups;
};

namespace BackupController {
  export const getAllBackups = catchAsync(async (req, res, next) => {
    const backups = await readExistingBackups();
    res.status(200).json({ backups });
  });

  export const createBackup = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const dumpProcess = dumpBackup();
    dumpProcess.on('error', error => {
      return res.status(500).json({
        message: error.message,
      });
    });

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
    next: NextFunction,
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
