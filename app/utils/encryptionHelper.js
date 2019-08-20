import bcrypt from 'bcryptjs';

export async function encrypt(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function compare(plainValue, encryptedValue) {
  return bcrypt.compare(plainValue, encryptedValue);
}
