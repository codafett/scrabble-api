import BaseSchema from './baseSchema';

// Define our model
const GameSchema = BaseSchema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
});

export default GameSchema;
