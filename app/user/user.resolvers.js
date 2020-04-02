import userService from './userService';

const resolvers = {
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
