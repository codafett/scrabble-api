/**
/* Created by reube on 13/07/2017.
*/
// Main starting point of the application
import express from 'express';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import methodOverride from 'method-override';
import {
  makeExecutableSchema,
} from 'apollo-server-express';
import mongoose from 'mongoose';

import logger, { logException } from './utils/logger';
import config from './config';

import {
  mergedTypes,
  mergedResolvers,
} from './graphql';

import configureDb from './db';

import createApolloServer from './apolloServer';

// App setup
logger.info('Setting up Express...');
const app = express();

// Morgan is a logging framework
logger.info('Setting up Morgan...');
app.use(morgan('combined'));
logger.info('Setting up parser 1...');
app.use(bodyParser.json());
logger.info('Setting up parser 2...');
app.use(bodyParser.json({ type: '*/*' }));
logger.info('Setting up middleware...');
app.use(httpContext.middleware);
logger.info('Setting up method-override');
app.use(methodOverride('X-HTTP-Method-Override'));
logger.info('Setting up cors...');
app.use(cors());
logger.info('Setting up headers...');
app.use((_req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

  // Pass to next layer of middleware
  next();
});
logger.info('Setting up parser 3...');
app.use(bodyParser.urlencoded({ extended: true }));

try {
  logger.info('Setting up db...');
  // Set up DB
  if (process.env.NODE_ENV !== 'test') {
    logger.debug('Configuring db...');
    configureDb();
  }
} catch (ex) {
  logger.error(ex.message);
}

// Server setup
const {
  port,
  testPort,
} = config;

let schema;
try {
  logger.info('making executable schema...');
  schema = makeExecutableSchema({
    typeDefs: mergedTypes,
    resolvers: mergedResolvers,
  });
  logger.info('made executable schema');
} catch (ex) {
  logException(ex);
  throw ex;
}

const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function getObjectId() {
  return this.toString();
};

logger.info('creating apollo server...');
let server;
try {
  server = createApolloServer(schema);
} catch (ex) {
  logException(ex);
  throw ex;
}
logger.info('created apollo server');

server.applyMiddleware({ app });
const serverPort = process.env.NODE_ENV === 'test'
  ? testPort
  : port;
app.listen({ port: serverPort });
logger.info(`Server listening on: ${serverPort}`);

export default app;
