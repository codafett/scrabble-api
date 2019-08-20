import {
  isVersionRunnable,
  runVersionScripts,
} from '.';
import { Version } from '../../models';
import { matchWholeWord } from '../../utils/stringUtils';

import logger from '../../utils/logger';

describe('versioning', () => {
  describe('isVersionRunnable', () => {
    function createVersion(major, minor, build) {
      return ({
        major,
        minor,
        build,
      });
    }
    it('should return FALSE when new major version < current major version', () => {
      const currentVersion = createVersion(2, 0, 0);
      const newVersion = createVersion(1, 0, 0);
      const result = isVersionRunnable(currentVersion, newVersion);
      expect(result).toBeFalsy();
    });
    it('should return TRUE when new major, minor and build versions match', () => {
      const currentVersion = createVersion(1, 2, 3);
      const newVersion = createVersion(1, 2, 3);
      const result = isVersionRunnable(currentVersion, newVersion);
      expect(result).toBeTruthy();
    });
    it('should return TRUE when new major version > current major version', () => {
      const currentVersion = createVersion(1, 9, 9);
      const newVersion = createVersion(2, 0, 0);
      const result = isVersionRunnable(currentVersion, newVersion);
      expect(result).toBeTruthy();
    });
    it('should return FALSE when new minor version < current minor version for SAME major version', () => {
      const currentVersion = createVersion(1, 9, 0);
      const newVersion = createVersion(1, 8, 0);
      const result = isVersionRunnable(currentVersion, newVersion);
      expect(result).toBeFalsy();
    });
    it('should return TRUE when new minor version > current minor version for SAME major version', () => {
      const currentVersion = createVersion(1, 8, 0);
      const newVersion = createVersion(1, 9, 0);
      const result = isVersionRunnable(currentVersion, newVersion);
      expect(result).toBeTruthy();
    });
    it('should return FALSE when new build version < current build version for SAME major AND minor version', () => {
      const currentVersion = createVersion(1, 8, 1);
      const newVersion = createVersion(1, 8, 0);
      const result = isVersionRunnable(currentVersion, newVersion);
      expect(result).toBeFalsy();
    });
    it('should return TRUE when new build version > current build version for SAME major AND minor version', () => {
      const currentVersion = createVersion(1, 8, 0);
      const newVersion = createVersion(1, 8, 1);
      const result = isVersionRunnable(currentVersion, newVersion);
      expect(result).toBeTruthy();
    });
  });

  describe('runVersionScripts', () => {
    let newVersion;
    let currentVersion;
    let getLatestVersionStub;
    let findSystemStub;
    let saveSystemStub;
    let loggerDebugStub;
    let scriptStub;
    let newSaveStub;
    const scriptName = 'script1';
    beforeEach(() => {
      scriptStub = jest.fn();
      newVersion = {
        major: 2,
        minor: 0,
        build: 0,
        scripts: [
          {
            name: scriptName,
            script: scriptStub,
          },
        ],
      };
      currentVersion = new Version();
      currentVersion.major = 1;
      currentVersion.minor = 0;
      currentVersion.build = 0;
      currentVersion.save = jest.fn();
      Version.find = jest.fn();
      findSystemStub = Version.find;
      saveSystemStub = currentVersion.save;
      Version.getLatestVersion = jest.fn();
      Version.prototype.save = jest.fn();
      newSaveStub = Version.prototype.save;
      getLatestVersionStub = Version.getLatestVersion;
      getLatestVersionStub.mockResolvedValue(currentVersion);
      findSystemStub.mockResolvedValue([]);
      logger.debug = jest.fn();
      loggerDebugStub = logger.debug;
    });
    it('should NOT run scripts if newVersion is less than dbVersion', async () => {
      currentVersion.major = 3;
      await runVersionScripts(newVersion);
      expect(scriptStub).not.toHaveBeenCalled();
    });
    it('should NOT run scripts if newVersion is same as dbVersion but script has already run', async () => {
      currentVersion.major = 2;
      currentVersion.scriptsRun.push({
        name: 'script1',
      });
      findSystemStub.mockResolvedValue([currentVersion]);
      saveSystemStub.mockResolvedValue(null);
      await runVersionScripts(newVersion);
      expect(scriptStub).not.toHaveBeenCalled();
      expect(saveSystemStub).not.toHaveBeenCalled();
      expect(loggerDebugStub).toHaveBeenCalledWith(`Script ${scriptName} has already been run against this database so skipping.`);
    });
    it('should run scripts if newVersion > dbVersion and script not already run', async () => {
      await runVersionScripts(newVersion);
      expect(scriptStub).toHaveBeenCalled();
      expect(newSaveStub).toHaveBeenCalled();
      expect(loggerDebugStub).toHaveBeenCalledWith(`Script ${scriptName} execution completed.`);
      const [savedSystem] = newSaveStub.mock.instances;
      expect(savedSystem.scriptsRun.filter(s => matchWholeWord('script1', s.name)).length).toEqual(1);
    });
    it('should run scripts if newVersion === dbVersion and script not already run', async () => {
      const localSaveStub = jest.fn();
      findSystemStub.mockResolvedValue([{
        ...newVersion,
        scriptsRun: [],
        save: localSaveStub,
      }]);
      await runVersionScripts(newVersion);
      expect(scriptStub).toHaveBeenCalled();
      expect(localSaveStub).toHaveBeenCalled();
      expect(loggerDebugStub).toHaveBeenCalledWith(`Script ${scriptName} execution completed.`);
      const [savedSystem] = localSaveStub.mock.instances;
      expect(savedSystem.scriptsRun.filter(s => matchWholeWord('script1', s.name)).length).toEqual(1);
    });
  });
});
