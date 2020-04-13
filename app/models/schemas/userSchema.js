import mongoose from 'mongoose';
import privatePaths from 'mongoose-private-paths';

import BaseSchema from './BaseSchema';

const { Schema } = mongoose;

// Define our model
const userSchema = BaseSchema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    private: true,
    required: true,
  },
  friends: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
  },
});

userSchema.plugin(privatePaths);

export default userSchema;
