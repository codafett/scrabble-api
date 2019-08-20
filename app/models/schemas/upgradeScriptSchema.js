import privatePaths from 'mongoose-private-paths';

import BaseSchema from './baseSchema';

// Define our model
const upgradeScriptSchema = BaseSchema({
  name: {
    type: String,
    required: true,
  },
});

upgradeScriptSchema.plugin(privatePaths);

export default upgradeScriptSchema;
