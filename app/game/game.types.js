import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    games: [Game]
  }

  type Game {
    _id: ID
    playerIds: [ID]
    players: [User]
    tiles: [Tile]
  }

  type Tile {
    _id: ID
    letter: String
    value: Int
    sortOrder: Int
    playerId: ID
    played: Boolean
  }

  type Mutation {
    start(
      userIds: [ID]
    ): Game
  }

`;
