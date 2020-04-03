import mongoose from 'mongoose';

import BaseSchema from './BaseSchema';

import TileSchema from './TileSchema';

const { Schema } = mongoose;

// Define our model
const GameSchema = BaseSchema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  playerIds: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
    required: true,
    default: [],
  },
  tiles: {
    type: [TileSchema],
    default: [],
  },
});

export default GameSchema;
