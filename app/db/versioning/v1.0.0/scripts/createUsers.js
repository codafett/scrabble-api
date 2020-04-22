import { User } from '../../../../models';
import encryptionHelper from '../../../../utils/encryptionHelper';

async function createUser(user) {
  let dbUser = await User.findOne({
    email: user.email,
  });
  if (!dbUser) {
    const passwordHash = await encryptionHelper.encrypt(user.password);
    dbUser = new User({
      ...user,
      passwordHash,
    });
    await dbUser.save();
  }
}

export default async function createAdminUser() {
  await createUser({
    email: 'reuben',
    password: 'scrabble',
    firstName: 'Reuben',
    lastName: 'Greaves',
  });
  await createUser({
    email: 'kath',
    password: 'scrabble',
    firstName: 'Kath',
    lastName: 'Scott',
  });
  await createUser({
    email: 'richard',
    password: 'scrabble',
    firstName: 'Richard',
    lastName: 'Greaves',
  });
  await createUser({
    email: 'esther',
    password: 'scrabble',
    firstName: 'Esther',
    lastName: 'Greaves',
  });
  await createUser({
    email: 'liz',
    password: 'scrabble',
    firstName: 'Liz',
    lastName: 'Greaves',
  });
  await createUser({
    email: 'brian',
    password: 'scrabble',
    firstName: 'Brian',
    lastName: 'Greaves',
  });
  await createUser({
    email: 'noah',
    password: 'scrabble',
    firstName: 'Noah',
    lastName: 'Greaves',
  });
  await createUser({
    email: 'evan',
    password: 'scrabble',
    firstName: 'Evan',
    lastName: 'Greaves',
  });
  await createUser({
    email: 'oscar',
    password: 'scrabble',
    firstName: 'Oscar',
    lastName: 'Greaves',
  });
  await createUser({
    email: 'toby',
    password: 'scrabble',
    firstName: 'Toby',
    lastName: 'Greaves',
  });
  await createUser({
    email: 'esme',
    password: 'scrabble',
    firstName: 'Esme',
    lastName: 'Greaves',
  });
}
