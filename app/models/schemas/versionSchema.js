import privatePaths from 'mongoose-private-paths';

import BaseSchema from './BaseSchema';
import upgradeScriptSchema from './UpgradeScriptSchema';

// Define our model
const versionSchema = BaseSchema({
  major: {
    type: Number,
    required: true,
  },
  minor: {
    type: Number,
    required: true,
  },
  build: {
    type: Number,
    required: true,
  },
  scriptsRun: {
    type: [upgradeScriptSchema],
    default: [],
  },
});

versionSchema.plugin(privatePaths);

versionSchema.statics.getLatestVersion = async function getLatestVersion() {
  const [version] = await this.find().sort({ major: -1, minor: -1, build: -1 }).limit(1);
  return version;
};

export default versionSchema;
