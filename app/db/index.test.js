import * as Versioning from './versioning';

import {
  executeReleaseScripts,
} from '.';

describe('db', () => {
  let runVersionScriptsStub;
  beforeEach(() => {
    Versioning.runVersionScripts = jest.fn();
    runVersionScriptsStub = Versioning.runVersionScripts;
  });
  describe('executeReleaseScripts', () => {
    it('should run the correct number of scripts', async () => {
      await executeReleaseScripts();
      expect(runVersionScriptsStub.mock.calls.length).toEqual(1);
    });
  });
});
