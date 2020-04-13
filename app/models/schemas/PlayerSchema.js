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
  sortOrder: {
    type: Number,
    required: true,
  },
  turns: {
    type: [TurnSchema],
    default: [],
  },
});

export default PlayerSchema;
