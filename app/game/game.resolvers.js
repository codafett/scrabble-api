import { authenticatedRequest } from '../auth/authRequests';
import gameService from './gameService';

const resolvers = {
  Query: {
    games: authenticatedRequest(
      async () => gameService.games(),
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
      ) => gameService.start(
        ownerId,
        userIds,
      ),
    ),
  },
};

export default resolvers;
