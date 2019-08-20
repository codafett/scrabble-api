/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill';
import { closeTestDb } from './app/utils/testUtils';

afterAll(async () => {
  closeTestDb();
});
