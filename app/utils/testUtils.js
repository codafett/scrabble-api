/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import shortid from 'shortid';

import { logException } from './logger';

export async function openTestDb() {
  // mongoServer = new MongoDBMemoryServer();
  mongoose.Promise = Promise;

  try {
    const mongoUri = `mongodb://127.0.0.1:27017/${shortid.generate()}`; // await mongoServer.getConnectionString();

    const mongooseOpts = { // options for mongoose 4.11.3 and above
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useNewUrlParser: true,
    };

    await mongoose.connect(mongoUri, mongooseOpts);
    mongoose.set('useCreateIndex', true);
    mongoose.connection.on('error', (e) => {
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

export async function closeTestDb() {
  try {
    await mongoose.disconnect();
  } catch (ex) {
    logException(ex);
    throw ex;
  }
}
