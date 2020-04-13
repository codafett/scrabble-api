import mongoose from 'mongoose';

import BaseSchema from './BaseSchema';

import TileSchema from './TileSchema';
import PlayerSchema from './PlayerSchema';
import GameStatusCodes from '../../enums/GameStatusCodes';

const { Schema } = mongoose;

// Define our model
const GameSchema = BaseSchema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  players: {
    type: [PlayerSchema],
    default: [],
  },
  tiles: {
    type: [TileSchema],
    default: [],
  },
  status: {
    type: Number,
    enum: Object.values(GameStatusCodes),
  },
  currentPlayer: {
    type: Schema.Types.ObjectId,
  },
});

export default GameSchema;
