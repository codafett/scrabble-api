/**
 * Created by reube on 13/07/2017.
 */

import mongoose from 'mongoose';

import userSchema from './schemas/userSchema';
import versionSchema from './schemas/versionSchema';

export const User = mongoose.model('user', userSchema, 'user');
export const Version = mongoose.model('version', versionSchema, 'version');
