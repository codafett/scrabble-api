import assert from 'assert';
import merge from 'lodash.merge';

import { User } from '../../models';
import {
  authenticate,
  tokenForUser,
  generateRefreshToken,
} from '../auth/authService';

import AppError from '../../appError';

import {
  USER_REQUIRED,
  USER_CANT_SAVE_NEW,
  USER_LOGIN_EMAIL_REQUIRED,
  USER_LOGIN_PASSWORD_REQUIRED,
} from './constants';

// eslint-disable-next-line import/prefer-default-export
export async function saveUser(user, createIfNotExists = false) {
  assert(user, USER_REQUIRED);

  await User.checkForDuplicates(user);

  let dbUser = await User.findById(user.id);

  if (!dbUser) {
    if (createIfNotExists) {
      dbUser = new User();
    } else {
      throw new Error(USER_CANT_SAVE_NEW);
    }
  }

  dbUser = merge(dbUser, user);
  await dbUser.save();

  return dbUser;
}

export async function login(email, password) {
  if (!email) {
    throw new AppError(USER_LOGIN_EMAIL_REQUIRED);
  }
  if (!password) {
    throw new AppError(USER_LOGIN_PASSWORD_REQUIRED);
  }
  const result = await authenticate(email, password);
  if (result.status === 200) {
    const token = tokenForUser(result.user);
    const refreshToken = generateRefreshToken();
    return ({
      token,
      refreshToken,
    });
  }
  throw new AppError(result.message);
}
