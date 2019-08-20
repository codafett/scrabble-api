import mongoose from 'mongoose';
import bluebird from 'bluebird';

import logger, { logException } from '../utils/logger';

import config from '../config';

import { matchWholeWord } from '../utils/stringUtils';

// Import when required
// import { runVersionScripts } from './versioning';

export const RESET_DB_REQUIRED = 'There are collections in the database but no version history, you should delete the existing database before restarting the application';

export async function executeReleaseScripts() {
  logger.debug('Running executeReleaseScripts...');
  // Run scripts in version order
  // E.G. runVersionScripts(version100);
  logger.debug('ExecuteReleaseScripts completed!');
}

export default function configureDb() {
  const uri = config.db;
  logger.debug('Got Uri...');

  mongoose.Promise = bluebird;

  mongoose.set('debug', matchWholeWord(config.logLevel, 'VERBOSE'));

  const promise = mongoose.connect(uri, { useNewUrlParser: true });

  try {
    promise.then(async () => {
      /* Use `db`, for instance `db.model()`
      */
      logger.info(`connected to ${uri}`);

      try {
        await executeReleaseScripts();
      } catch (ex) {
        logException(ex);
        process.exit();
      }
    });
  } catch (ex) {
    logException(ex);
    process.exit();
  }

  mongoose.connection.on('error', (err) => {
    logException(err);
  });
}
