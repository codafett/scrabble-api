import userService from './userService';
import { authenticatedRequest } from '../auth/authRequests';

const resolvers = {
  Query: {
    users: authenticatedRequest(
      (
        _obj,
        _args,
        {
          user: {
            _id: userId,
          },
        },
      ) => userService.getUsers(
        userId,
      ),
    ),
  },

  Mutation: {
    login: async (_obj, { email, password }) => userService.login(email, password),
    createUser: async (
      _obj,
      {
        email,
        firstName,
        lastName,
        password,
        passwordConfirmation,
      },
    ) => userService.createUser(
      email,
      firstName,
      lastName,
      password,
      passwordConfirmation,
    ),
  },
};

export default resolvers;
