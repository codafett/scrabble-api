import bcrypt from 'bcryptjs';

const EncryptionHelper = () => ({
  encrypt: async function encrypt(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  compare: async function compare(plainValue, encryptedValue) {
    return bcrypt.compare(plainValue, encryptedValue);
  },
});

export default EncryptionHelper();
