import AuthManager from './authManager';
import { GROUP_ADMIN, AdminGroup } from './groups';
import Permissions from './permissions';
import {
  UNAUTHORISED_ACCESS_ERROR_MESSAGE,
  PERMISSION_DENIED,
} from '../constants';

describe('AuthManager', () => {
  describe('getGroupPermissionIds', () => {
    it('should return empty array when group has no permissions', () => {
      const result = AuthManager.getGroupPermissionIds({});
      expect(result).toEqual([]);
    });
    it('should return array of permission ids when group has permissions', () => {
      const expected = AdminGroup.permissions.map(p => p.id);
      const result = AuthManager.getGroupPermissionIds(AdminGroup);
      expect(result).toEqual(expected);
    });
  });
  describe('getGroupPermissionIdsByName', () => {
    it('should return empty array when group has no permissions', () => {
      const result = AuthManager.getGroupPermissionIdsByName('NONAME');
      expect(result).toEqual([]);
    });
    it('should return array of permission ids when group has permissions', () => {
      const expected = AdminGroup.permissions.map(p => p.id);
      const result = AuthManager.getGroupPermissionIdsByName(AdminGroup.name);
      expect(result).toEqual(expected);
    });
  });
  describe('permissionsForUser', () => {
    it('should return empty array when user is not in any groups', () => {
      const result = AuthManager.permissionsForUser({});
      expect(result).toEqual([]);
    });
    it('should return empty array when user.group does not match any groups', () => {
      const result = AuthManager.permissionsForUser({
        groups: ['InvalidGroup'],
      });
      expect(result).toEqual([]);
    });
    it('should return array of permissions from matching groups', () => {
      const expected = AdminGroup.permissions.map(p => p.id);
      const result = AuthManager.permissionsForUser({
        groups: [GROUP_ADMIN],
      });
      expect(result).toEqual(expected);
    });
  });

  describe('authorise', () => {
    it('should throw UNAUTHORISED_ACCESS_ERROR_MESSAGE if user is not authenticated', () => {
      expect(() => AuthManager.authorise()
        .toThrow(UNAUTHORISED_ACCESS_ERROR_MESSAGE));
    });
    it('should throw UNAUTHORISED_ACCESS_ERROR_MESSAGE if user is not authenticated', () => {
      expect(() => AuthManager.authorise(false)
        .toThrow(UNAUTHORISED_ACCESS_ERROR_MESSAGE));
    });
    it('should NOT throw any error if user is authenticated and NO permissions is passed', () => {
      expect(() => AuthManager.authorise(true)
        .not.toThrow());
    });
    it('should throw PERMISSION_DENIED error when user has no groups', () => {
      expect(() => AuthManager.authorise(true, {}, Permissions.user.add)
        .toThrow(PERMISSION_DENIED));
    });
    it('should throw PERMISSION_DENIED error when the user does not have a group with the relevant permission', () => {
      expect(
        () => AuthManager.authorise(
          true,
          {
            groups: [GROUP_ADMIN],
          },
          'MADE UP PERMISSION',
        ),
      ).toThrow(PERMISSION_DENIED);
    });
    it('should NOT throw PERMISSION_DENIED error when the user has a groups with the relevant permission', () => {
      expect(
        () => AuthManager.authorise(
          true,
          {
            groups: [GROUP_ADMIN],
          },
          Permissions.user.add,
        ),
      ).not.toThrow();
    });
  });
});
