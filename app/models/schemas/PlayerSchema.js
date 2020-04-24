import mongoose from 'mongoose';

import BaseSchema from './BaseSchema';
import TurnSchema from './TurnSchema';

const { Schema } = mongoose;

// Define our model
const PlayerSchema = BaseSchema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  playOrder: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  turns: {
    type: [TurnSchema],
    default: [],
  },
});

export default PlayerSchema;
