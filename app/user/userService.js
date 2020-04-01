import assert from 'assert';
import emailValidator from 'email-validator';

import { User } from '../models';
import authService from '../auth/authService';

import AppError from '../appError';

import {
  USER_REQUIRED,
  USER_CANT_SAVE_NEW,
  USER_LOGIN_EMAIL_REQUIRED,
  USER_LOGIN_PASSWORD_REQUIRED,
  USER_EMAIL_ALREADY_REGISTERED,
  USER_PASSWORDS_DO_NOT_MATCH,
  EMAIL_IS_REQUIRED,
  PASSWORD_IS_REQUIRED,
  PASSWORD_CONFIRMATION_IS_REQUIRED,
  EMAIL_IS_INVALID,
  PASSWORDS_DO_NOT_MATCH,
  FIRST_NAME_IS_REQUIRED,
  LAST_NAME_IS_REQUIRED,
} from './constants';
import encryptionHelper from '../utils/encryptionHelper';
import { matchWholeWordRegEx, matchWholeWord } from '../utils/stringUtils';
import logger from '../utils/logger';

const UserService = () => ({
  createUser: async function createUser(
    email,
    firstName,
    lastName,
    password,
    passwordConfirmation,
  ) {
    assert(email, EMAIL_IS_REQUIRED);
    assert(firstName, FIRST_NAME_IS_REQUIRED);
    assert(lastName, LAST_NAME_IS_REQUIRED);
    assert(password, PASSWORD_IS_REQUIRED);
    assert(passwordConfirmation, PASSWORD_CONFIRMATION_IS_REQUIRED);

    if (!emailValidator.validate(email)) {
      throw new AppError(
        EMAIL_IS_INVALID,
      );
    }

    if (!matchWholeWord(
      password,
      passwordConfirmation,
      '',
    )) {
      throw new AppError(
        PASSWORDS_DO_NOT_MATCH,
      );
    }

    const user = new User({
      email,
      firstName,
      lastName,
      passwordHash: await encryptionHelper.encrypt(password),
    });

    await this.checkForDuplicates(user);

    await user.save();

    return user;
  },

  changePassword: async function changePassword(
    userId,
    currentPassword,
    newPassword,
  ) {
    const user = await User.findById(userId);
    if (user.passwordHash) {
      const isMatch = await encryptionHelper.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        throw new AppError(USER_PASSWORDS_DO_NOT_MATCH);
      }
    }
    user.passwordHash = await encryptionHelper.encrypt(newPassword);
  },

  checkForDuplicates: async function checkForDuplicates(
    user,
  ) {
    const duplicate = await User.findOne({
      $and: [
        {
          _id: { $ne: user._id },
        },
        {
          email: matchWholeWordRegEx(user.email),
        },
      ],
    });

    if (duplicate) {
      logger.error(`User ${user.email} cannot be registered because it's already registered`);
      throw new AppError(USER_EMAIL_ALREADY_REGISTERED);
    }
  },

  saveUser: async function saveUser(user) {
    assert(user, USER_REQUIRED);

    await this.checkForDuplicates(user);

    const dbUser = await User.findById(user.id);

    if (!dbUser) {
      throw new Error(USER_CANT_SAVE_NEW);
    }

    dbUser.set(user);
    await dbUser.save();

    return dbUser;
  },

  login: async function login(email, password) {
    if (!email) {
      throw new AppError(USER_LOGIN_EMAIL_REQUIRED);
    }
    if (!password) {
      throw new AppError(USER_LOGIN_PASSWORD_REQUIRED);
    }
    const result = await authService.authenticate(email, password);
    if (result.status === 200) {
      const token = authService.tokenForUser(result.user);
      const refreshToken = authService.generateRefreshToken();
      return ({
        token,
        refreshToken,
      });
    }
    throw new AppError(result.message);
  },
});

export default UserService();
