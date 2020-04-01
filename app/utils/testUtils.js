/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import shortid from 'shortid';

import { logException } from './logger';
import { User } from '../models';
import encryptionHelper from './encryptionHelper';

export async function openTestDb() {
  // mongoServer = new MongoDBMemoryServer();
  mongoose.Promise = Promise;

  try {
    const mongoUri = `mongodb://127.0.0.1:27017/${shortid.generate()}`; // await mongoServer.getConnectionString();

    const mongooseOpts = { // options for mongoose 4.11.3 and above
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(mongoUri, mongooseOpts);
    mongoose.connection.on('error', (e) => {
      logException(e);
      if (e.message.code === 'ETIMEDOUT') {
        mongoose.connect(mongoUri, mongooseOpts);
      }
    });
    mongoose.connection.once('open', () => {});
  } catch (ex) {
    logException(ex);
    throw ex;
  }
  return mongoose.connection;
}

export async function resetDb(connection) {
  try {
    await connection.db.dropDatabase();
  } catch (ex) {
    logException(ex);
    throw ex;
  }
}

export async function closeTestDb(connection) {
  try {
    await connection.close();
  } catch (ex) {
    logException(ex);
    throw ex;
  }
}

export async function createTestUser(data = {}) {
  const passwordHash = data.password
    ? await encryptionHelper.encrypt(data.password)
    : await encryptionHelper.encrypt(shortid.generate());
  return new User({
    email: 'email@email.com',
    firstName: shortid.generate(),
    lastName: shortid.generate(),
    passwordHash,
    ...data,
  });
}

export async function createTestUserAndSave(data) {
  const user = await createTestUser(data);
  await user.save();
  return user;
}
