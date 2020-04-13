import { authenticatedRequest } from '../auth/authRequests';
import gameService from './gameService';

const resolvers = {
  Query: {
    games: authenticatedRequest(
      async (
        _obj,
        _args,
        {
          user: {
            _id: userId,
          },
        },
      ) => gameService.getGames(
        userId,
      ),
    ),

    game: authenticatedRequest(
      async (
        _obj,
        {
          gameId,
        },
        {
          user: {
            _id: userId,
          },
        },
      ) => gameService.getGame(
        gameId,
        userId,
      ),
    ),
  },

  Mutation: {
    start: authenticatedRequest(
      async (
        _obj,
        {
          userIds,
        },
        {
          user: {
            _id: ownerId,
          },
        },
      ) => gameService.startGame(
        ownerId,
        userIds,
      ),
    ),

    play: authenticatedRequest(
      async (
        _obj,
        {
          gameId,
          tileIds,
          score,
        },
        {
          user: {
            _id: userId,
          },
        },
      ) => gameService.play(
        userId,
        gameId,
        tileIds,
        score,
      ),
    ),
  },
};

export default resolvers;
