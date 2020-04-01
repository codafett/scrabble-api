/**
 * Created by reube on 13/07/2017.
 */

import mongoose from 'mongoose';

import userSchema from './schemas/UserSchema';
import versionSchema from './schemas/VersionSchema';
import gameSchema from './schemas/GameSchema';

export const User = mongoose.model('user', userSchema, 'user');
export const Version = mongoose.model('version', versionSchema, 'version');

export const Game = mongoose.model('game', gameSchema, 'game');
