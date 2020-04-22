import assert from 'assert';

import { Game, User } from '../models';
import tileSet from '../models/tileSets';
import { shuffle } from '../utils/arrayUtils';
import AppError from '../appError';

const MAX_NUMBER_OF_PLAYER_TILES = 7;

const GameService = () => ({
  getGames: async function Games(
    userId,
  ) {
    const pipeline = [
      {
        $match: {
          'players.userId': userId,
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'players.userId',
          foreignField: '_id',
          as: 'players',
        },
      },
    ];
    return Game.aggregate(pipeline);
  },

  startGame: async function Start(
    ownerId,
    userIds,
  ) {
    assert(ownerId, 'OwnerId is required');
    assert(userIds && userIds.length, 'userIds required');

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

    gameTiles = shuffle(gameTiles).map(
      (tile, index) => ({
        ...tile,
        sortOrder: index,
      }),
    );

    let players = userIds.map(
      (userId) => ({
        userId,
      }),
    );

    players.push({
      userId: ownerId,
    });

    players = shuffle(players).map(
      (player, index) => ({
        ...player,
        playOrder: index,
      }),
    );

    const game = new Game({
      ownerId,
      players,
      tiles: gameTiles,
    });
    game.currentPlayerId = game.players[0]._id;

    await game.save();

    await players.reduce(
      async (promise, player) => {
        await promise;
        await this.selectTiles(
          game._id,
          player.userId,
        );
      },
      Promise.resolve(),
    );

    return game._id;
  },

  getGame: async function getGame(
    gameId,
    userId,
  ) {
    const game = await Game.findById(gameId);
    const players = await User.find({
      _id: {
        $in: game.players
          .filter((p) => !p.userId.equals(userId))
          .map((p) => p.userId),
      },
    });
    const currentPlayer = game.players.find(
      (p) => p.userId.equals(userId),
    );
    const myTiles = game.tiles.filter(
      (tile) => (
        tile.playerId
        && tile.playerId.equals(currentPlayer._id)
        && !tile.played
      ),
    );

    return ({
      _id: game._id,
      players,
      myTiles,
      lastTurn: await this.getPlayerLastTurn(
        gameId,
        userId,
      ),
    });
  },

  getPlayerLastTurn: async function getPlayerLastTurn(
    gameId,
    userId,
  ) {
    let lastPlayedTiles = [];
    let lastPlayedScore;

    const game = await Game.findById(gameId);
    const currentPlayer = game.players.find(
      (p) => p.userId.equals(userId),
    );

    if (
      currentPlayer.turns
      && currentPlayer.turns.length
    ) {
      const playerLastTurn = currentPlayer.turns[
        currentPlayer.turns.length - 1
      ];
      lastPlayedScore = playerLastTurn.score;
      lastPlayedTiles = playerLastTurn.tileIds.map(
        (tileId) => game.tiles.find(
          (t) => t._id.equals(tileId),
        ),
      );
    }

    return {
      tiles: lastPlayedTiles,
      score: lastPlayedScore,
    };
  },

  selectTiles: async function getTiles(
    gameId,
    userId,
  ) {
    const game = await Game.findById(gameId);
    const player = game.players.find(
      (p) => p.userId.equals(userId),
    );

    const availableTiles = game.tiles.filter(
      (t) => !t.playerId,
    );

    const playersTiles = game.tiles.filter(
      (t) => t.playerId
        && t.playerId.equals(player._id)
        && !t.played,
    );

    const tilesRequired = MAX_NUMBER_OF_PLAYER_TILES - playersTiles.length;

    if (tilesRequired >= availableTiles.length) {
      availableTiles.forEach(
        (tile) => tile.set({
          playerId: player._id,
        }),
      );
    } else {
      const shuffledTiles = shuffle(availableTiles);
      for (let i = 0; i < tilesRequired; i += 1) {
        shuffledTiles[i].set({
          playerId: player._id,
        });
      }
    }

    await game.save();

    return game.tiles.filter(
      (tile) => tile.playerId
        && tile.playerId.equals(player._id)
        && !tile.played,
    );
  },

  play: async function play(
    userId,
    gameId,
    tileIds,
    score,
  ) {
    const game = await Game.findById(gameId);
    const player = game.players.find(
      (p) => p.userId.equals(userId),
    );

    if (!game.currentPlayerId.equals(player._id)) {
      throw new AppError(
        'Sorry, it\'s not your turn!',
      );
    }

    player.turns.push(
      {
        tileIds,
        score,
      },
    );

    tileIds.forEach(
      (tileId) => {
        const gameTile = game.tiles.find(
          (t) => t._id.equals(tileId)
            && t.playerId.equals(player._id),
        );
        if (gameTile) {
          gameTile.set({ played: true });
        }
      },
    );

    let nextPlayerOrder = 0;
    if (player.playOrder < game.players.length - 1) {
      nextPlayerOrder = player.playOrder + 1;
    }

    const nextPlayer = game.players.find(
      (p) => p.playOrder === nextPlayerOrder,
    );

    game.currentPlayerId = nextPlayer._id;

    await game.save();

    const newTiles = this.selectTiles(
      gameId,
      userId,
    );

    return {
      tiles: newTiles,
      lastTurn: await this.getPlayerLastTurn(
        gameId,
        userId,
      ),
    };
  },
});

export default GameService();
