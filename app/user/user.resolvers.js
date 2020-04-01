import userService from './userService';

const resolvers = {
  Mutation: {
    login: async (_obj, { email, password }) => userService.login(email, password),
  },
};

export default resolvers;
