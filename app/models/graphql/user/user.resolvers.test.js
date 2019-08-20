import * as userService from '../../../services/user/userService';

import userResolvers from './user.resolvers';

describe('userResolvers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('login', () => {
    let loginStub;
    beforeEach(() => {
      loginStub = jest.spyOn(userService, 'login');
    });
    it('should call login on user service with undefined values when none passed', async () => {
      loginStub.mockResolvedValue({ token: '1234' });
      await userResolvers.Mutation.login(null, {});
      expect(loginStub).toHaveBeenCalledWith(undefined, undefined);
    });
    it('should call login on user service with values passed in', async () => {
      loginStub.mockResolvedValue({ token: '1234' });
      await userResolvers.Mutation.login(null, { email: 'e@e.com', password: 'pwd' });
      expect(loginStub).toHaveBeenCalledWith('e@e.com', 'pwd');
    });
    it('should return the token supplied from login', async () => {
      const expected = { token: '1234' };
      loginStub.mockResolvedValue(expected);
      const result = await userResolvers.Mutation.login(null, { email: 'e@e.com', password: 'pwd' });
      expect(result).toEqual(expected);
    });
  });
});
