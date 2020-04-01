import { User } from '..';

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
  });
});
