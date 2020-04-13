import mongoose from 'mongoose';

import BaseSchema from './BaseSchema';

const { Schema } = mongoose;

// Define our model
const TileSchema = BaseSchema({
  letter: {
    type: String,
  },
  value: {
    type: Number,
    required: true,
  },
  sortOrder: {
    type: Number,
    required: true,
  },
  playerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  played: {
    type: Boolean,
    default: false,
  },
});

export default TileSchema;
