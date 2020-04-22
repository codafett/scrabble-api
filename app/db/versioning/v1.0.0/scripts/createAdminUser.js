import generator from 'generate-password';

import { User } from '../../../../models';
import encryptionHelper from '../../../../utils/encryptionHelper';
import logger from '../../../../utils/logger';

export default async function createAdminUser() {
  const userCount = await User.countDocuments();
  if (!userCount) {
    const email = 'admin@scrabble.com';
    const password = generator.generate({
      length: 8,
      numbers: true,
      lowercase: true,
      uppercase: true,
      symbols: true,
      excludeSimilarCharacters: true,
    });
    const passwordHash = await encryptionHelper.encrypt(password);
    const user = new User({
      email,
      passwordHash,
      firstName: 'Admin',
      lastName: 'Admin',
    });
    await user.save();
    logger.info(`User: ${email} created with password ${password}`);
  }
}
