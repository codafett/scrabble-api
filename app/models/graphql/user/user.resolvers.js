import { login } from '../../../services/user/userService';

const resolvers = {
  Mutation: {
    login: async (_obj, { email, password }) => login(email, password),
  },
};

export default resolvers;
