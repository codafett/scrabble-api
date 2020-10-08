import mongoose from 'mongoose';

import BaseSchema from './baseSchema';
import InvitationSchema from './InvitationSchema';

const { Schema } = mongoose;

// Define our model
const GameInviteSchema = BaseSchema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  invitation: {
    type: [InvitationSchema],
  },
});

export default GameInviteSchema;
