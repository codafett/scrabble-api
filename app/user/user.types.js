import { gql } from 'apollo-server-express';

export default gql`

  type Query {
    users: [User]
  }

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
  }

  type Mutation {
    login(email: String, password: String): LoginResponse
    createUser(
      email: String
      firstName: String
      lastName: String
      password: String
      passwordConfirmation: String
    ): User
  }

  type LoginResponse {
    token: String
    refreshToken: String
  }
`;
