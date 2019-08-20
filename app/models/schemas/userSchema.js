import privatePaths from 'mongoose-private-paths';

import BaseSchema from './baseSchema';
import { encrypt, compare } from '../../utils/encryptionHelper';
import { matchWholeWordRegEx } from '../../utils/stringUtils';
import AppError from '../../appError';
import logger from '../../utils/logger';

export const USER_EMAIL_ALREADY_REGISTERED = 'User email has already been registered';
export const USER_PASSWORDS_DO_NOT_MATCH = 'Passwords do not match';

// Define our model
const userSchema = BaseSchema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  passwordHash: {
    type: String,
    private: true,
    required: true,
  },
});

userSchema.plugin(privatePaths);

userSchema.methods.changePassword = async function changePassword(currentPassword, newPassword) {
  const user = this;
  if (this.passwordHash) {
    const isMatch = await compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError(USER_PASSWORDS_DO_NOT_MATCH);
    }
  }
  user.passwordHash = await encrypt(newPassword);
};

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  const user = this;
  return compare(candidatePassword, user.passwordHash);
};

userSchema.statics.checkForDuplicates = async function checkForDuplicates(
  user,
) {
  const duplicate = await this.findOne({
    $and: [
      {
        _id: { $ne: user.id },
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
};

export default userSchema;
