import { getGroup, GROUP_ADMIN, AdminGroup } from './groups';
import Permissions from './permissions';

import AuthManager from './authManager';

describe('groups', () => {
  describe('getGroup', () => {
    it('should return undefined is group not found', () => {
      const result = getGroup('');
      expect(result).toBeUndefined();
    });
    it('should return admin group', () => {
      const result = getGroup(GROUP_ADMIN);
      expect(result).toEqual(AdminGroup);
    });
  });

  describe('AdminGroup permissions', () => {
    it('should have the correct permissions', () => {
      const adminGroup = getGroup(GROUP_ADMIN);
      expect(adminGroup).toBeDefined();
      const user = {
        groups: [GROUP_ADMIN],
      };
      expect(AuthManager.authorise(true, user, Permissions.user.add)).toBeTruthy();
      expect(AuthManager.authorise(true, user, Permissions.user.edit)).toBeTruthy();
      expect(AuthManager.authorise(true, user, Permissions.user.list)).toBeTruthy();
    });
  });
});
