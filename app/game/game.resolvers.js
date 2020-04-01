import { authenticatedRequest } from '../auth/authRequests';
import gameService from './gameService';

const resolvers = {
  Query: {
    games: authenticatedRequest(
      async () => gameService.games()
    )
  },
};

export default resolvers;
