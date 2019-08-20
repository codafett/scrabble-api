import {
  User,
} from '../../models';

import {
  saveUser,
  login,
} from './userService';

import * as authService from '../auth/authService';

import {
  USER_REQUIRED,
  USER_CANT_SAVE_NEW,
  USER_LOGIN_EMAIL_REQUIRED,
  USER_LOGIN_PASSWORD_REQUIRED,
} from './constants';
import { AssertionError } from 'assert';

describe('userService', () => {
  describe('mocked tests', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('saveClient', () => {
      let user;
      let checkForDuplicatesStub;
      let userFindByIdStub;
      beforeEach(() => {
        user = new User();
        user.email = 'a@a.com';
        user.save = jest.fn();
        userFindByIdStub = jest.spyOn(User, 'findById').mockResolvedValue(null);
        checkForDuplicatesStub = jest.spyOn(User, 'checkForDuplicates').mockResolvedValue(null);
      });
      describe('errors', () => {
        it('should throw USER_REQUIRED if NULL passed', async () => {
          try {
            await saveUser();
          } catch (ex) {
            expect(ex.message).toEqual(USER_REQUIRED)
          }
        });
        it('should throw USER_CANT_SAVE_NEW if new item passed but createIfExists is not passed', async () => {
          try {
            await saveUser(user);
          } catch (ex) {
            expect(ex.message).toEqual(USER_CANT_SAVE_NEW)
          } finally {
            expect(checkForDuplicatesStub).toHaveBeenCalledWith(user);
            expect(user.save).not.toHaveBeenCalled();
          }
        });
        it('should throw USER_CANT_SAVE_NEW if new item passed but createIfExists is FALSE', async () => {
          try {
            await saveUser(user, false);
          } catch (ex) {
            expect(ex.message).toEqual(USER_CANT_SAVE_NEW)
          } finally {
            expect(checkForDuplicatesStub).toHaveBeenCalledWith(user);
            expect(user.save).not.toHaveBeenCalled();
          }
        });
      });
      describe('happy paths', () => {
        it('should call save for new object when passed createIfNotExists TRUE', async () => {
          user.email = 'a@a.com';
          const result = await saveUser(user, true);
          expect(checkForDuplicatesStub).toHaveBeenCalledWith(user);
          expect(user.save).toHaveBeenCalled()
          expect(result).toEqual(user);
        });
        it('should call save for existing object when passed createIfNotExists FALSE', async () => {
          const dbUser = new User();
          dbUser.email = 'a@a.com';
          userFindByIdStub.mockResolvedValue(dbUser);
          const result = await saveUser(user, false);
          expect(checkForDuplicatesStub).toHaveBeenCalledWith(user);
          expect(user.save).toHaveBeenCalled()
          expect(result).toEqual(user);
        });
        it('should call save for existing object when passed createIfNotExists TRUE', async () => {
          const dbUser = new User();
          dbUser.email = 'a@b.com';
          userFindByIdStub.mockResolvedValue(dbUser);
          const result = await saveUser(user, true);
          expect(checkForDuplicatesStub).toHaveBeenCalledWith(user);
          expect(user.save).toHaveBeenCalled()
          expect(result).toEqual(user);
        });
      });
    });

    describe('login', () => {
      let authenticateStub;
      let tokenForUserStub;
      let generateRefreshTokenStub;
      beforeEach(() => {
        authenticateStub = jest.spyOn(authService, 'authenticate');
        tokenForUserStub = jest.spyOn(authService, 'tokenForUser');
        generateRefreshTokenStub = jest.spyOn(authService, 'generateRefreshToken');
      });
      it('should throw an error if email is not passed', async () => {
        try {
          await login();
        } catch (ex) {
          expect(ex.message).toEqual(USER_LOGIN_EMAIL_REQUIRED);
        }
      });
      it('should throw an error if password is not passed', async () => {
        try {
          await login('e@e.com');
        } catch (ex) {
          expect(ex.message).toEqual(USER_LOGIN_PASSWORD_REQUIRED);
        }
      });
      it('should return authentication error when authenticate result status is NOT 200', async () => {
        const message = 'ERROR';
        authenticateStub.mockResolvedValue({ status: 201, message });
        try {
          await login('e@e.com', 'pwd');
        } catch (ex) {
          expect(ex.message).toEqual(message);
        }
      });
      it('should call tokenForUser and generateRefreshToken when authenicate returns status 200', async () => {
        const user = { name: 'user' };
        authenticateStub.mockResolvedValue({ status: 200, user });
        await login('e@e.com', 'pwd');
        expect(tokenForUserStub).toHaveBeenCalledWith(user);
        expect(generateRefreshTokenStub).toHaveBeenCalled();
      });
    });
  });
});
