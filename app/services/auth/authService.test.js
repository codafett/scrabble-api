import jwt from 'jsonwebtoken';

import config from '../../config';
import { User } from '../../models';
import {
  authenticate,
  tokenForUser,
  processAuthenticationResult,
} from './authService';

import {
  INCORRECT_EMAIL_ADDRESS,
  INCORRECT_PASSWORD,
} from './constants';

describe('authServices', async () => {
  let req;
  let res;
  let send;
  let statusSpy;
  beforeEach(() => {
    send = jest.fn();
    res = {
      status: () => ({ send }),
      send,
      json: jest.fn(),
    };
    req = {
      login: jest.fn(),
    };
    statusSpy = jest.spyOn(res, 'status');
  });
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
      const result = await authenticate('w@w.com', '1234');
      expect(result.user).toBeNull();
      expect(result.status).toEqual(422);
      expect(result.message).toEqual(INCORRECT_EMAIL_ADDRESS);
    });
    it('should return Incorrect Password when password match fails', async () => {
      const expectedResult = {
        comparePassword: () => false,
      };
      userFindStub.mockResolvedValue(expectedResult);
      const result = await authenticate('w@w.com', '1234');
      expect(result.user).toBeNull();
      expect(result.status).toEqual(422);
      expect(result.message).toEqual(INCORRECT_PASSWORD);
    });
  });

  describe('tokenForUser', () => {
    it('should return a jwt', async () => {
      const token = tokenForUser({ id: '1234', clientId: '5678' });
      expect(token).toBeDefined();
      const decodedToken = await jwt.verify(token, config.secret);
      expect(decodedToken.sub).toEqual('1234');
      expect(decodedToken.cid).toEqual('5678');
      expect(decodedToken.iat).toBeDefined();
    });
  });
});
