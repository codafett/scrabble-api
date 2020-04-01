import { Schema } from 'mongoose';
import httpContext from 'express-http-context';
import mongooseLeanId from 'mongoose-lean-id';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate';
import { matchWholeWordRegEx } from '../../utils/stringUtils';

import { TEST_USER_EMAIL_ADDRESS } from './constants';

function BaseSchema(schemaDefinition) {
  const newSchemaDefinition = Object.assign({}, schemaDefinition);
  newSchemaDefinition.lastUpdatedByEmail = {
    type: String,
  };
  const newSchema = new Schema(
    newSchemaDefinition,
    {
      timestamps: true,
      toObject: { virtuals: true, getters: true },
      toJSON: { virtuals: true, getters: true },
    },
  );

  newSchema.virtual('id').get(function id() {
    /* eslint-disable no-underscore-dangle */
    return this._id;
  });

  newSchema.pre('save', async function onSave() {
    let user = httpContext.get('user');
    const regex = matchWholeWordRegEx('test');
    if (!user && (!process.env.NODE_ENV || process.env.NODE_ENV.match(regex))) {
      user = { email: TEST_USER_EMAIL_ADDRESS };
    }
    this.lastUpdatedByEmail = user.email;
  });

  newSchema.plugin(mongooseLeanId);
  newSchema.plugin(mongooseAggregatePaginate);

  return newSchema;
}

export default BaseSchema;
