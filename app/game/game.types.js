import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    games: [Game]
  }

  type Game {
    _id: ID
    name: String
    users: [User]
  }

  type Mutation {
    start(
      name: String
      userIds: [ID]
    ): StartResponse
  }

  type StartResponse {
    _id: ID
  }
`;
