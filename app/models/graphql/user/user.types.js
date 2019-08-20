import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    login(email: String, password: String): LoginResponse
  }

  type LoginResponse {
    token: String
    refreshToken: String
  }
`;
