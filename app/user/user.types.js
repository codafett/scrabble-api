import { gql } from 'apollo-server-express';

export default gql`

  type User {
    _id: ID
    firstName: String
    lastName: String
  }

  type Mutation {
    login(email: String, password: String): LoginResponse
  }

  type LoginResponse {
    token: String
    refreshToken: String
  }
`;
