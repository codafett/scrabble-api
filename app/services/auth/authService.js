/**
 * Created by reube on 13/07/2017.
 */
import jwt from 'jsonwebtoken';
import randToken from 'rand-token';

import { User } from '../../models';
import config from '../../config';
import logger from '../../utils/logger';

import {
  INCORRECT_EMAIL_ADDRESS,
  INCORRECT_PASSWORD,
} from './constants';

export function tokenForUser(user) {
  // jwt have a convention that sub property which is the subject
  // also conventions iat = issued at time
  const timestamp = new Date().getTime();
  return jwt.sign(
    {
      sub: user.id,
      cid: user.clientId,
      iat: timestamp,
    },
    config.secret,
    {
      expiresIn: '1hr',
    },
  );
}

export function generateRefreshToken() {
  return randToken.uid(256);
}

export async function authenticate(email, password) {
  const user = await User.findOne({ email });
  const result = {
    status: 200,
    message: '',
    user: null,
  };

  if (!user) {
    logger.debug(`User not found ${email}`);
    result.status = 422;
    result.message = INCORRECT_EMAIL_ADDRESS;
    return result;
  }

  logger.debug(`Checking password for ${email}`);

  // compare password - is 'password' equal to user.password?
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    logger.debug(`Password incorrect for ${email}`);
    result.status = 422;
    result.message = INCORRECT_PASSWORD;
    return result;
  }
  logger.info(`Returning user ${email}`);
  result.user = user;
  return result;
}
