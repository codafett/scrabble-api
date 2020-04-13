import mongoose from 'mongoose';

import BaseSchema from './BaseSchema';
import InvitationStatusCodes from '../../enums/InvitationStatusCodes';

const { Schema } = mongoose;

// Define our model
const InvitationSchema = BaseSchema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  status: {
    type: Number,
    enum: Object.values(InvitationStatusCodes),
  },
});

export default InvitationSchema;
