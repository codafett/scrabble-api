/**
 * Created by reube on 15/07/2017.
 */
// Hold application config

import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  secret: process.env.JWT_TOKEN_SECRET,
  port: process.env.PORT || '3094',
  testPort: process.env.TEST_PORT || '3095',
  db: process.env.DB,
  logLevel: process.env.LOG_LEVEL,
  engineApiToken: process.env.ENGINE_API_TOKEN,
  engineProcessTimeout: process.env.ENGINE_PROCESS_TIMEOUT_MINUTES,
  graphiql: process.env.GRAPHIQL,
};
