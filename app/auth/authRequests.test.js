import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

import {
  authorisedRequest,
  authenticatedRequest,
} from './authRequests';
import {
  PERMISSION_DENIED,
  UNAUTHORISED_ACCESS_ERROR_MESSAGE,
} from './constants';
import AuthManager from './authManager';
import permissions from './permissions';

describe('authRequests', () => {
  let resolverFunction;
  let authoriseStub;
  beforeEach(() => {
    resolverFunction = jest.fn();
    AuthManager.authorise = jest.fn().mockReturnValue(true);
    authoriseStub = AuthManager.authorise;
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('authorisedRequest', () => {
    it('should call AuthManager.authorise passing in the permission', async () => {
      const obj = { name: 'obj' };
      const args = { name: 'args' };
      const context = { name: 'context', user: { name: 'leo' }, isAuthenticated: true };
      await authorisedRequest(
        permissions.user.list,
        resolverFunction,
      )(
        obj,
        args,
        context,
      );
      expect(AuthManager.authorise).toHaveBeenCalledWith(
        context.isAuthenticated,
        context.user,
        permissions.user.list,
      );
    });
    it('should throw UNAUTHORISED_ACCESS_ERROR_MESSAGE if not authenticated', async () => {
      const obj = { name: 'obj' };
      const args = { name: 'args' };
      const context = { name: 'context', isAuthenticated: false };
      AuthManager.authorise.mockImplementation(() => {
        throw new AuthenticationError(UNAUTHORISED_ACCESS_ERROR_MESSAGE);
      });
      await expect(
        authorisedRequest(
          null,
          resolverFunction,
        )(
          obj,
          args,
          context,
        ),
      ).rejects.toThrow(UNAUTHORISED_ACCESS_ERROR_MESSAGE);
    });
    it('should call the resovler function passing in obj, args and context', async () => {
      const obj = { name: 'obj' };
      const args = { name: 'args' };
      const context = { name: 'context', isAuthenticated: true };
      await authorisedRequest(
        null,
        resolverFunction,
      )(
        obj,
        args,
        context,
      );
      expect(resolverFunction).toHaveBeenCalledWith(
        obj,
        args,
        context,
      );
    });
  });
  describe('authenticatedRequest', () => {
    it('should throw UNAUTHORISED_ACCESS_ERROR_MESSAGE if not authenticated', async () => {
      const obj = { name: 'obj' };
      const args = { name: 'args' };
      const context = { name: 'context', isAuthenticated: false };
      AuthManager.authorise.mockImplementation(() => {
        throw new AuthenticationError(UNAUTHORISED_ACCESS_ERROR_MESSAGE);
      });
      await expect(
        authenticatedRequest(
          resolverFunction,
        )(
          obj,
          args,
          context,
        ),
      ).rejects.toThrow(UNAUTHORISED_ACCESS_ERROR_MESSAGE);
    });
    it('should throw PERMISSION_DENIED if user does not have correct permission', async () => {
      const obj = { name: 'obj' };
      const args = { name: 'args' };
      const context = { name: 'context', isAuthenticated: false };
      AuthManager.authorise.mockImplementation(() => {
        throw new ForbiddenError(PERMISSION_DENIED);
      });
      await expect(
        authenticatedRequest(
          resolverFunction,
        )(
          obj,
          args,
          context,
        ),
      ).rejects.toThrow(PERMISSION_DENIED);
    });
    it('should call the resovler function passing in obj, args and context', async () => {
      const obj = { name: 'obj' };
      const args = { name: 'args' };
      const context = { name: 'context', isAuthenticated: true };
      await authenticatedRequest(
        resolverFunction,
      )(
        obj,
        args,
        context,
      );
      expect(resolverFunction).toHaveBeenCalledWith(
        obj,
        args,
        context,
      );
    });
  });
});
