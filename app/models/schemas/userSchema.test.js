import {
  openTestDb,
  resetDb,
  closeTestDb,
} from '../../utils/testUtils';

import { User } from '..';
import {
  USER_EMAIL_ALREADY_REGISTERED,
  USER_PASSWORDS_DO_NOT_MATCH,
} from './userSchema';

describe('userSchema', () => {
  describe('mocked tests', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    describe('new user', () => {
      it('should error if the users passwordHash has not been set', async () => {
        const newUser = new User({
          email: 'a@a.com',
        });
        newUser.validate((err) => {
          expect(err).toBeDefined();
        });
      });
    });

    describe('changePassword', () => {
      it('should hash the users password', async () => {
        const newUser = new User({
          email: 'a@a.com',
        });
        await newUser.changePassword('', 'Appscore1');
        expect(newUser.passwordHash).toBeDefined();
      });
      it('should not error if the users passwordHash has been set', async () => {
        const newUser = new User({
          email: 'a@a.com',
        });
        await newUser.changePassword('', 'Appscore1');
        expect(newUser.passwordHash).toBeDefined();
      });
      it('should change password when current password correct', async () => {
        const newUser = new User({
          email: 'a@a.com',
        });
        await newUser.changePassword('', 'Appscore1');
        const currentHash = newUser.passwordHash;
        await newUser.changePassword('Appscore1', 'newPassword');
        const newHash = newUser.passwordHash;
        expect(newHash).toBeDefined();
        expect(currentHash).not.toEqual(newHash);
      });
      it('should throw error when current password incorrect', async () => {
        const newUser = new User({
          email: 'a@a.com',
        });
        let result;
        await newUser.changePassword('', 'Appscore1');
        try {
          await newUser.changePassword('000udge5cake', 'newPassword');
        } catch (ex) {
          result = ex;
        } finally {
          expect(result.message).toEqual(USER_PASSWORDS_DO_NOT_MATCH);
        }
      });
    });

    describe('comparePassword', () => {
      it('should return true for matching password', async () => {
        const newUser = new User({
          email: 'a@a.com',
        });
        await newUser.changePassword('', 'Appscore1');
        const isMatch = newUser.comparePassword('Appscore1');
        expect(isMatch).toBeTruthy;
      });
      it('should return false for non-matching password', async () => {
        const newUser = new User({
          email: 'a@a.com',
        });
        await newUser.changePassword('', 'Appscore1');
        const isMatch = newUser.comparePassword('fudge5cake');
        expect(isMatch).toBeFalsy;
      });
    });

    describe('checkForDuplicates', () => {
      let user;
      let userFindOneStub;
      beforeEach(() => {
        user = new User();
        user.email = 'a@a.com';
        userFindOneStub = jest.spyOn(User, 'findOne');
      });
      describe('errors', () => {
        it('should throw USER_EMAIL_ALREADY_REGISTERED error if user.email has already been used', async () => {
          const duplicateUser = new User();
          duplicateUser.email = user.email;
          userFindOneStub.mockResolvedValue(duplicateUser);
          let result;
          try {
            await User.checkForDuplicates(user);
            expect(true).toEqual(false);
          } catch (ex) {
            result = ex;
          } finally {
            expect(result).toBeDefined();
            expect(result.message).toEqual(USER_EMAIL_ALREADY_REGISTERED);
          }
        });
      });
    });
  });

  describe('db operations', async () => {
    let user;
    let connection;
    beforeAll(async () => {
      connection = await openTestDb();
    });
    afterAll(async () => {
      await closeTestDb();
    });
    beforeEach(async () => {
      user = new User();
      user.email = 'a@a.com';
    });
    afterEach(async () => {
      await resetDb(connection);
    });
    describe('checkForDuplicates', () => {
      let dbUser;
      beforeEach(async () => {
        dbUser = new User();
        dbUser.email = 'a@a.com';
        await dbUser.changePassword('', 'pass');
        await dbUser.save();
      });
      describe('errors', () => {
        it('should throw USER_EMAIL_ALREADY_REGISTERED error if user.email has already been used', async () => {
          let result;
          try {
            await User.checkForDuplicates(user);
          } catch (ex) {
            result = ex;
          } finally {
            expect(result).toBeDefined();
            expect(result.message).toEqual(USER_EMAIL_ALREADY_REGISTERED);
          }
        });
      });
      describe('happy paths', () => {
        it('should not error when user.email is not a duplicate', async () => {
          user.email = 'b@a.com';
          let error;
          try {
            await User.checkForDuplicates(user);
          } catch (ex) {
            error = ex;
          } finally {
            expect(error).toBeUndefined();
          }
        });
        it('should not error when it finds the same record', async () => {
          let error;
          try {
            await User.checkForDuplicates(dbUser);
          } catch (ex) {
            error = ex;
          } finally {
            expect(error).toBeUndefined();
          }
        });
      });
    });
  });
});
