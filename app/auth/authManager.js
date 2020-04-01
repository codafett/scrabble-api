import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

import Groups, { getGroup } from './groups';
import { matchWholeWord } from '../utils/stringUtils';
import {
  UNAUTHORISED_ACCESS_ERROR_MESSAGE,
  PERMISSION_DENIED,
} from '../constants';

const AuthManager = () => ({
  getGroupPermissionIds: function getGroupPermissionIds(group) {
    return group && group.permissions
      ? group.permissions.map(
        p => p.id,
      )
      : [];
  },

  getGroupPermissionIdsByName: function getGroupPermissionIdsByName(name) {
    const [sg] = Groups.filter(g => matchWholeWord(g.name, name));
    return this.getGroupPermissionIds(sg);
  },

  permissionsForUser: function permissionsForUser(user) {
    if (!user || !user.groups || !user.groups.length) {
      return [];
    }
    return user.groups.reduce(
      (prev, curr) => {
        const grp = getGroup(curr);
        if (grp) {
          return prev.concat(this.getGroupPermissionIds(grp));
        }
        return prev;
      },
      [],
    );
  },

  authorise: function authorise(isAuthenticated, user, permission) {
    if (!isAuthenticated) {
      throw new AuthenticationError(UNAUTHORISED_ACCESS_ERROR_MESSAGE);
    }
    if (permission) {
      const userPermissions = this.permissionsForUser(user);
      if (!userPermissions.filter(p => matchWholeWord(permission.id, p)).length) {
        throw new ForbiddenError(PERMISSION_DENIED);
      }
    }
    return true;
  },
});

export default AuthManager();
