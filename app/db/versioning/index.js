import { Version } from '../../models';

import { matchWholeWord } from '../../utils/stringUtils';
import logger from '../../utils/logger';

export function isVersionRunnable(currentVersion, newVersion) {
  let runScripts = !currentVersion;
  if (!runScripts) {
    if (newVersion.major > currentVersion.major) {
      runScripts = true;
    } else if (newVersion.major === currentVersion.major) {
      if (newVersion.minor > currentVersion.minor) {
        runScripts = true;
      } else if (newVersion.minor === currentVersion.minor) {
        if (newVersion.build >= currentVersion.build) {
          runScripts = true;
        }
      }
    }
  }
  return runScripts;
}

export async function runVersionScripts(newVersion) {
  logger.debug(`Running upgrade scripts for version ${newVersion.major}.${newVersion.minor}.${newVersion.build}.....`);
  const currentVersion = await Version.getLatestVersion();
  const runScripts = isVersionRunnable(currentVersion, newVersion);
  let [dbVersion] = await Version.find({
    major: newVersion.major,
    minor: newVersion.minor,
    build: newVersion.build,
  });
  if (!dbVersion) {
    dbVersion = new Version();
    dbVersion.major = newVersion.major;
    dbVersion.minor = newVersion.minor;
    dbVersion.build = newVersion.build;
    dbVersion.scriptsRun = [];
    await dbVersion.save();
  }
  if (runScripts && newVersion.scripts && newVersion.scripts.length) {
    await newVersion.scripts.reduce(async (previous, s) => {
      await previous;
      logger.debug(`Processing script ${s.name}`);
      const [alreadyRun] = dbVersion.scriptsRun.filter(
        (dbScript) => matchWholeWord(s.name, dbScript.name),
      );
      if (!alreadyRun) {
        logger.debug(`Running script ${s.name}...`);
        await s.script();
        dbVersion.scriptsRun.push({
          name: s.name,
        });
        logger.debug(`Saving version ${newVersion.major}.${newVersion.minor}.${newVersion.build}`);
        await dbVersion.save();
        logger.debug(`Script ${s.name} execution completed.`);
      } else {
        logger.debug(`Script ${s.name} has already been run against this database so skipping.`);
      }
      return Promise.resolve();
    }, Promise.resolve());
  }
  logger.debug(`Upgrade scripts for version ${newVersion.major}.${newVersion.minor}.${newVersion.build} completed!`);
}
