import mongoose from 'mongoose';

import BaseSchema from './BaseSchema';

const { Schema } = mongoose;

// Define our model
const TurnSchema = BaseSchema({
  tileIds: {
    type: [Schema.Types.ObjectId],
    ref: 'tile',
    required: true,
  },
  score: {
    type: Number,
  },
});

export default TurnSchema;
