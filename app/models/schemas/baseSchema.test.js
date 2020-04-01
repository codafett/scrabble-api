import mongoose from 'mongoose';
import httpContext from 'express-http-context';

import { openTestDb, resetDb, closeTestDb } from '../../utils/testUtils';
import { TEST_USER_EMAIL_ADDRESS } from './constants';

import BaseSchema from './BaseSchema';

describe('baseSchema', () => {
  const TestSchema = new BaseSchema({});
  const TestModel = mongoose.model('test', TestSchema, 'tests');
  let sut;
  beforeEach(() => {
    sut = new TestModel();
  });
  it('should add id field to new objects', () => {
    expect(Object.prototype.hasOwnProperty.call(sut, 'id')).toBeTruthy;
  });
  it('should have id === _id', () => {
    /* eslint-disable no-underscore-dangle */
    expect(sut.id).toEqual(sut._id);
  });
  it('should have id field on toJson object', () => {
    const sutJson = JSON.parse(JSON.stringify(sut));
    expect(Object.prototype.hasOwnProperty.call(sutJson, 'id')).toBeTruthy;
  });
  it('should add created field to new objects', () => {
    expect(Object.prototype.hasOwnProperty.call(sut, 'createAt')).toBeTruthy;
  });
  it('should add updated field to new objects', () => {
    expect(Object.prototype.hasOwnProperty.call(sut, 'updatedAt')).toBeTruthy;
  });
  describe('save', () => {
    const BaseModel = mongoose.model('base', BaseSchema({}), 'base');
    let httpContextGetStub;
    let connection;
    beforeAll(async () => {
      connection = await openTestDb();
    });
    afterAll(async () => {
      await closeTestDb(connection);
    });
    beforeEach(async () => {
      httpContextGetStub = jest.spyOn(httpContext, 'get');
    });
    afterEach(async () => {
      await resetDb(connection);
      jest.restoreAllMocks();
    });
    it('should set lastUpdatedByEmail for PROD', async () => {
      const email = 'w@w.com';
      httpContextGetStub.mockReturnValue({ email });
      const currentEnv = process.env.NODE_ENV;
      try {
        const base = new BaseModel();
        process.env.NODE_ENV = 'PROD';
        await base.save();
        expect(base.lastUpdatedByEmail).toEqual(email);
      } finally {
        process.env.NODE_ENV = currentEnv;
      }
    });
    it('should set lastUpdatedByEmail for TEST', async () => {
      const currentEnv = process.env.NODE_ENV;
      try {
        const base = new BaseModel();
        process.env.NODE_ENV = 'TEST';
        await base.save();
        expect(base.lastUpdatedByEmail).toEqual(TEST_USER_EMAIL_ADDRESS);
      } finally {
        process.env.NODE_ENV = currentEnv;
      }
    });
  });
});
