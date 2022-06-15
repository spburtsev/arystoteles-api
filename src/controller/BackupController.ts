import { Request, Response, NextFunction } from 'express';
import catchAsync from '../lib/helpers/catch-async';
import BackupMethod from '../model/enum/BackupMethod';
import path from 'path';
import fs from 'fs/promises';
import Backup, { IBackup } from '../model/data/schema/Backup';
import BackupService from '../service/BackupService';

const readExistingBackups = async () => {
  const backupPath = path.join(__dirname, '../../backup/');
  const backupFiles = await fs.readdir(backupPath, 'utf-8');
  const backups = await Backup.find({})
    .sort({ createdAt: 'desc' })
    .populate('createdBy')
    .exec();

  let validBackups: Array<IBackup> = [];
  let invalidBackups: Array<IBackup> = [];

  backups.forEach((backup: IBackup) => {
    if (
      backupFiles.some(
        fileName => fileName.split('.gzip')[0] === backup.fileName,
      )
    ) {
      validBackups.push(backup);
    } else {
      invalidBackups.push(backup);
    }
  });
  invalidBackups.forEach(async backup => await backup.remove());
  return validBackups;
};

namespace BackupController {
  export const getAllBackups = catchAsync(async (req, res, next) => {
    const backups = await readExistingBackups();
    res.status(200).json({ total: backups.length, backups });
  });

  export const createBackup = (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const fileName = req.body.fileName;
    const dumpProcess = BackupService.dumpBackup(fileName);

    dumpProcess.on('exit', async (code, signal) => {
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
      const backup = new Backup({
        fileName,
        method: BackupMethod.Mongodump,
        createdAt: new Date(),
        createdBy: req.user.id,
      });
      await backup.save();

      return res.status(200).json({
        message: 'Backup created successfully',
        backup,
      });
    });
  };

  export const restoreFromBackup = catchAsync(async (req, res, next) => {
    const fileName = req.params.fileName;
    const backup = await Backup.findOne({ fileName });

    const preservedBackups = await Backup.find({
      createdAt: { $gte: backup.createdAt },
    }).exec();
    const restoreProcess = BackupService.restore(fileName);
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
      preservedBackups.forEach(
        async backup => await new Backup(backup.preserve()).save(),
      );
      return res.status(200).json({
        message: 'Successfully restored the database',
      });
    });
  });
}
export default BackupController;
