import { gql } from 'apollo-server-express';

export default gql`
  scalar Date

  type Query {
    games: [Game]
    game (
      gameId: ID
    ): Game
  }

  type Game {
    _id: ID
    players: [PlayerSummary]
    lastTurn: Turn
    myTiles: [Tile]
    createdAt: Date
  }

  type Tile {
    _id: ID
    letter: String
    value: Int
    sortOrder: Int
    playerId: ID
    played: Boolean
  }

  type PlayerSummary {
    firstName: String
    lastName: String
    email: String
  }

  type Player {
    _id: ID
    user: User
    tiles: [Tile]
  }

  type Turn {
    tiles: [Tile]
    score: Int
  }

  type Mutation {
    start(
      userIds: [ID]
    ): ID
    play(
      gameId: ID
      tileIds: [ID]
      score: Int
    ): PlayResult
  }

  type PlayResult {
    tiles: [Tile]
    lastTurn: Turn
  }

`;
