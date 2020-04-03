import assert from 'assert';

import { Game, User } from '../models';
import tileSet from '../models/tileSets';

const GameService = () => ({
  games: async function Games() {
    return Promise.resolve([]);
  },

  start: async function Start(
    ownerId,
    playerIds,
  ) {
    assert(ownerId, 'OwnerId is required');
    assert(playerIds && playerIds.length, 'PlayerIds required');

    let gameTiles = tileSet.reduce(
      (tiles, tile) => {
        for (let i = 0; i < tile.count; i += 1) {
          tiles.push({
            letter: tile.letter,
            value: tile.value,
          });
        }
        return tiles;
      },
      [],
    );

    gameTiles = gameTiles.map(
      (tile, index) => {
        const sortOrder = index + (Math.floor(Math.random() * (gameTiles.length - index)));
        return {
          ...tile,
          sortOrder,
        };
      },
    );

    const game = new Game({
      ownerId,
      playerIds,
      tiles: gameTiles,
    });

    await game.save();

    const players = User.find({
      _id: {
        $in: [
          ownerId,
          ...playerIds,
        ],
      },
    });
    return ({
      ...game.toObject(),
      players,
    });
  },
});

export default GameService();
