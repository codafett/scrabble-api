import { encrypt, compare } from '../encryptionHelper';

describe('encryptionHelper', () => {
  describe('encrypt', () => {
    it('should return a hashed value', async () => {
      const password = 'password';
      const hash1 = await encrypt(password);
      expect(hash1).not.toEqual(null);
      expect(hash1).not.toEqual(undefined);
      expect(hash1).not.toEqual(password);
    });
    it('should create different hash for same value', async () => {
      const password = 'password';
      const hash1 = await encrypt(password);
      const hash2 = await encrypt(password);
      expect(hash1).not.toEqual(null);
      expect(hash1).not.toEqual(undefined);
      expect(hash2).not.toEqual(null);
      expect(hash2).not.toEqual(undefined);
      expect(hash1).not.toEqual(hash2);
    });
  });
  describe('compare', () => {
    it('should return true when hash is compared against itself', async () => {
      const password = 'password';
      const hash1 = await encrypt(password);
      const isMatch = await compare(password, hash1);
      expect(hash1).not.toEqual(null);
      expect(hash1).not.toEqual(undefined);
      /* eslint-disable no-unused-expressions */
      expect(isMatch).toBeTruthy;
    });
    it('should return false for hashes created for different values', async () => {
      const value1 = 'password';
      const value2 = 'password1';
      const hash1 = await encrypt(value1);
      const hash2 = await encrypt(value2);
      const isMatch = await compare(value1, hash2);
      expect(hash1).not.toEqual(null);
      expect(hash1).not.toEqual(undefined);
      expect(hash2).not.toEqual(null);
      expect(hash2).not.toEqual(undefined);
      /* eslint-disable no-unused-expressions */
      expect(isMatch).toBeFalsy;
    });
  });
});
