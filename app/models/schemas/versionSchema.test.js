import {
  Version,
} from '../index';

import {
  openTestDb,
  resetDb,
  closeTestDb,
} from '../../utils/testUtils';

describe('SystemSchema', () => {
  let connection;
  beforeAll(async () => {
    connection = await openTestDb();
  });
  afterAll(async () => {
    await closeTestDb();
  });
  afterEach(async () => {
    await resetDb(connection);
  });

  function createVersion(major, minor, build) {
    const system = new Version();
    system.major = major;
    system.minor = minor;
    system.build = build;
    return system;
  }

  describe('getLatestVersion', () => {
    it('should return the null if there are no System records', async () => {
      const result = await Version.getLatestVersion();
      expect(result).toBeUndefined();
    });
    it('should return the latest based on major version number', async () => {
      const system1 = createVersion(1, 0, 0);
      await system1.save();
      const system2 = createVersion(2, 0, 0);
      await system2.save();
      const result = await Version.getLatestVersion();
      expect(result.major).toEqual(system2.major);
      expect(result.minor).toEqual(system2.minor);
      expect(result.build).toEqual(system2.build);
    });
    it('should return the latest based on minor version number', async () => {
      const system1 = createVersion(1, 0, 0);
      await system1.save();
      const system2 = createVersion(1, 1, 0);
      await system2.save();
      const result = await Version.getLatestVersion();
      expect(result.major).toEqual(system2.major);
      expect(result.minor).toEqual(system2.minor);
      expect(result.build).toEqual(system2.build);
    });
    it('should return the latest based on build version number', async () => {
      const system1 = createVersion(1, 0, 0);
      await system1.save();
      const system2 = createVersion(1, 0, 1);
      await system2.save();
      const result = await Version.getLatestVersion();
      expect(result.major).toEqual(system2.major);
      expect(result.minor).toEqual(system2.minor);
      expect(result.build).toEqual(system2.build);
    });
  });
});
