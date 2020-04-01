import jwt from 'jsonwebtoken';

import config from '../config';
import { User } from '../models';
import authService from './authService';

import {
  INCORRECT_EMAIL_ADDRESS,
  INCORRECT_PASSWORD,
} from './constants';

describe('authServices', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('authenticate', () => {
    let userFindStub;
    beforeEach(() => {
      userFindStub = jest.spyOn(User, 'findOne');
    });
    it('should return Incorrect Email Address when not matched', async () => {
      userFindStub.mockResolvedValue(null);
      const result = await authService.authenticate('w@w.com', '1234');
      expect(result.user).toBeNull();
      expect(result.status).toEqual(422);
      expect(result.message).toEqual(INCORRECT_EMAIL_ADDRESS);
    });
    it('should return Incorrect Password when password match fails', async () => {
      const expectedResult = {
        comparePassword: () => false,
      };
      userFindStub.mockResolvedValue(expectedResult);
      const result = await authService.authenticate('w@w.com', '1234');
      expect(result.user).toBeNull();
      expect(result.status).toEqual(422);
      expect(result.message).toEqual(INCORRECT_PASSWORD);
    });
  });

  describe('tokenForUser', () => {
    it('should return a jwt', async () => {
      const token = authService.tokenForUser({ id: '1234', clientId: '5678' });
      expect(token).toBeDefined();
      const decodedToken = await jwt.verify(token, config.secret);
      expect(decodedToken.sub).toEqual('1234');
      expect(decodedToken.cid).toEqual('5678');
      expect(decodedToken.iat).toBeDefined();
    });
  });
});
