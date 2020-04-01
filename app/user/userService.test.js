import shortid from 'shortid';
import {
  User,
} from '../models';

import userService from './userService';

import authService from '../auth/authService';

import {
  USER_REQUIRED,
  USER_CANT_SAVE_NEW,
  USER_LOGIN_EMAIL_REQUIRED,
  USER_LOGIN_PASSWORD_REQUIRED,
  EMAIL_IS_REQUIRED,
  PASSWORD_IS_REQUIRED,
  PASSWORD_CONFIRMATION_IS_REQUIRED,
  EMAIL_IS_INVALID,
  PASSWORDS_DO_NOT_MATCH,
  LAST_NAME_IS_REQUIRED,
  FIRST_NAME_IS_REQUIRED,
  USER_EMAIL_ALREADY_REGISTERED,
  USER_PASSWORDS_DO_NOT_MATCH,
} from './constants';
import {
  createTestUserAndSave,
  openTestDb,
  resetDb,
  closeTestDb,
  createTestUser,
} from '../utils/testUtils';
import encryptionHelper from '../utils/encryptionHelper';

describe('userService', () => {
  describe('createUser', () => {
    let connection;
    beforeAll(async () => {
      connection = await openTestDb();
    });
    afterEach(async () => {
      await resetDb(connection);
    });
    afterAll(async () => {
      await closeTestDb(connection);
    });

    it('should throw EMAIL_IS_REQUIRED if email is not passed in', async () => {
      await expect(
        userService.createUser(),
      ).rejects.toThrow(EMAIL_IS_REQUIRED);
    });

    it('should throw FIRST_NAME_IS_REQUIRED if firstName is not passed in', async () => {
      await expect(
        userService.createUser(
          'email@email.com',
        ),
      ).rejects.toThrow(FIRST_NAME_IS_REQUIRED);
    });

    it('should throw LAST_NAME_IS_REQUIRED if lastName is not passed in', async () => {
      await expect(
        userService.createUser(
          'email@email.com',
          'firstName',
        ),
      ).rejects.toThrow(LAST_NAME_IS_REQUIRED);
    });

    it('should throw PASSWORD_IS_REQUIRED if password is not passed in', async () => {
      await expect(
        userService.createUser(
          'email@email.com',
          'firstName',
          'lastName',
        ),
      ).rejects.toThrow(PASSWORD_IS_REQUIRED);
    });

    it('should throw PASSWORD_CONFIRMATION_IS_REQUIRED if passwordConfirmation is not passed in', async () => {
      await expect(
        userService.createUser(
          'email@email.com',
          'firstName',
          'lastName',
          'password',
        ),
      ).rejects.toThrow(PASSWORD_CONFIRMATION_IS_REQUIRED);
    });

    it('should throw EMAIL_IS_INVALID if email is not valid', async () => {
      await expect(
        userService.createUser(
          'email@email',
          'firstName',
          'lastName',
          'password',
          'password',
        ),
      ).rejects.toThrow(EMAIL_IS_INVALID);
    });

    it('should throw PASSWORDS_DO_NOT_MATCH if password and passwordConfirmation do NOT match (CASE SENSITIVE)', async () => {
      await expect(
        userService.createUser(
          'email@email.com',
          'firstName',
          'lastName',
          'password',
          'Password',
        ),
      ).rejects.toThrow(PASSWORDS_DO_NOT_MATCH);
    });

    it('should throw PASSWORDS_DO_NOT_MATCH if password and passwordConfirmation do NOT match (DIFFERENT VALUES)', async () => {
      await expect(
        userService.createUser(
          'email@email.com',
          'firstName',
          'lastName',
          'password',
          'password2',
        ),
      ).rejects.toThrow(PASSWORDS_DO_NOT_MATCH);
    });

    it('should throw USER_EMAIL_ALREADY_REGISTERED when user already exists', async () => {
      await createTestUserAndSave({
        email: 'email@email.com',
      });
      await expect(
        userService.createUser(
          'email@email.com',
          'firstName',
          'lastName',
          'password',
          'password',
        ),
      ).rejects.toThrow(USER_EMAIL_ALREADY_REGISTERED);
    });

    it('should save the user', async () => {
      const user = await userService.createUser(
        'email@email.com',
        'firstName',
        'lastName',
        'password',
        'password',
      );
      const dbUser = await User.findById(user._id);
      expect(dbUser.toObject()).toEqual(user.toObject());
    });
  });

  describe('changePassword', () => {
    let connection;
    beforeAll(async () => {
      connection = await openTestDb();
    });
    afterEach(async () => {
      await resetDb(connection);
    });
    afterAll(async () => {
      await closeTestDb(connection);
    });
    it('should throw USER_PASSWORDS_DO_NOT_MATCH if the password if the currentPassword does not match the db password (CASE SENSITIVE)', async () => {
      const user = await createTestUserAndSave({ password: 'password' });
      await expect(
        userService.changePassword(
          user._id,
          'Password',
          'newPassword',
        ),
      ).rejects.toThrow(USER_PASSWORDS_DO_NOT_MATCH);
    });

    it('should throw USER_PASSWORDS_DO_NOT_MATCH if the password if the currentPassword does not match the db password (DIFFERENT VALUES)', async () => {
      const user = await createTestUserAndSave({ password: 'password' });
      await expect(
        userService.changePassword(
          user._id,
          'oldPassword',
          'newPassword',
        ),
      ).rejects.toThrow(USER_PASSWORDS_DO_NOT_MATCH);
    });

    it('should save the new password', async () => {
      const user = await createTestUserAndSave({ password: 'oldPassword' });
      await userService.changePassword(
        user._id,
        'oldPassword',
        'newPassword',
      );
      const dbUser = await User.findById(user._id);
      expect(dbUser.passwordHash).toEqual(user.passwordHash);
    });
  });

  describe('checkForDuplicates', () => {
    let connection;
    beforeAll(async () => {
      connection = await openTestDb();
    });
    afterEach(async () => {
      await resetDb(connection);
    });
    afterAll(async () => {
      await closeTestDb(connection);
    });
    it('should throw USER_EMAIL_ALREADY_REGISTERED when user already exists', async () => {
      await createTestUserAndSave({
        email: 'email@email.com',
      });
      await expect(
        userService.checkForDuplicates({
          email: 'email@email.com',
        }),
      ).rejects.toThrow(USER_EMAIL_ALREADY_REGISTERED);
    });
    it('should NOT throw USER_EMAIL_ALREADY_REGISTERED for a new user', async () => {
      await expect(
        userService.checkForDuplicates({
          email: 'email@email.com',
        }),
      ).not.rejects;
    });
    it('should NOT throw USER_EMAIL_ALREADY_REGISTERED for the SAME user', async () => {
      const user = await createTestUserAndSave({
        email: 'email@email.com',
      });
      await expect(
        userService.checkForDuplicates(user),
      ).not.rejects;
    });
  });

  describe('saveUser', () => {
    let connection;
    beforeAll(async () => {
      connection = await openTestDb();
    });
    afterEach(async () => {
      await resetDb(connection);
    });
    afterAll(async () => {
      await closeTestDb(connection);
    });

    it('should throw USER_EMAIL_ALREADY_REGISTERED when user already exists', async () => {
      await createTestUserAndSave({
        email: 'email@email.com',
      });
      await expect(
        userService.saveUser({
          email: 'email@email.com',
        }),
      ).rejects.toThrow(USER_EMAIL_ALREADY_REGISTERED);
    });

    it('should throw USER_REQUIRED if NULL passed', async () => {
      try {
        await userService.saveUser();
      } catch (ex) {
        expect(ex.message).toEqual(USER_REQUIRED);
      }
    });

    it('should throw USER_CANT_SAVE_NEW if new item passed', async () => {
      const user = await createTestUser();
      await expect(
        userService.saveUser(user),
      ).rejects.toThrow(USER_CANT_SAVE_NEW);
      const dbUser = await User.findById(user._id);
      expect(dbUser).toBeNull();
    });

    it('should save an existing user changes', async () => {
      const user = await createTestUserAndSave();
      user.email = shortid.generate();
      user.firstName = shortid.generate();
      user.lastName = shortid.generate();
      user.passwordHash = encryptionHelper.encrypt(shortid.generate());
      await userService.saveUser(user);
      const dbUser = await User.findById(user._id);
      expect(dbUser.toObject()).toEqual({
        ...user.toObject(),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('login', () => {
    let connection;
    let authenticateStub;
    let tokenForUserStub;
    let generateRefreshTokenStub;
    beforeAll(async () => {
      connection = await openTestDb();
    });
    beforeEach(() => {
      authenticateStub = jest.spyOn(authService, 'authenticate');
      tokenForUserStub = jest.spyOn(authService, 'tokenForUser');
      generateRefreshTokenStub = jest.spyOn(authService, 'generateRefreshToken');
    });
    afterEach(async () => {
      await resetDb(connection);
      jest.restoreAllMocks();
    });
    afterAll(async () => {
      await closeTestDb(connection);
    });

    it('should throw USER_LOGIN_EMAIL_REQUIRED if email is not passed', async () => {
      await expect(
        userService.login(),
      ).rejects.toThrow(USER_LOGIN_EMAIL_REQUIRED);
    });
    it('should throw USER_LOGIN_PASSWORD_REQUIRED if password is not passed', async () => {
      await expect(
        userService.login(
          'e@e.com',
        ),
      ).rejects.toThrow(USER_LOGIN_PASSWORD_REQUIRED);
    });
    it('should return authentication error when authenticate result status is NOT 200', async () => {
      const message = 'ERROR';
      authenticateStub.mockResolvedValue({ status: 201, message });
      try {
        await userService.login('e@e.com', 'pwd');
      } catch (ex) {
        expect(ex.message).toEqual(message);
      }
    });
    it('should call tokenForUser and generateRefreshToken when authenticate returns status 200', async () => {
      const user = { name: 'user' };
      authenticateStub.mockResolvedValue({ status: 200, user });
      await userService.login('e@e.com', 'pwd');
      expect(tokenForUserStub).toHaveBeenCalledWith(user);
      expect(generateRefreshTokenStub).toHaveBeenCalled();
    });
  });
});
