import {
  ApolloServer,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';
import jwt from 'jwt-simple';

import logger, { logException } from './utils/logger';
import config from './config';

import { User } from './models';

export default function createApolloServer(schema) {
  let server;
  try {
    server = new ApolloServer({
      schema,
      context: async ({ req }) => {
        const token = req.headers['x-access-token'] || '';
        let user;
        if (token && token.length) {
          const decoded = jwt.decode(token, config.secret);
          user = await User.findById(decoded.sub);
        }
        return {
          isAuthenticated: !!user,
          user,
        };
      },
      formatError: (error) => {
        logException(error);
        if (
          error.originalError instanceof AuthenticationError
          || error.originalError instanceof ForbiddenError
          || error.originalError instanceof UserInputError
          || error.isAppError
          || (error.originalError && error.originalError.isAppError)
        ) {
          return ({
            message: error.message,
          });
        }
        return ({
          message: 'Internal Server Error',
        });
      },
    });
  } catch (ex) {
    logException(ex);
    throw ex;
  }
  logger.info('created apollo server');
  return server;
}
