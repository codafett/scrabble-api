import {
  throwErrorIfTruthy,
  throwErrorIfFalsy,
  throwAppErrorIfTruthy,
  throwAppErrorIfFalsy,
} from './errorHelper';
import AppError from '../appError';

describe('errorHelper', () => {
  describe('throwErrorIfTruthy', () => {
    it('should throw an error if the condition is TRUE', () => {
      expect(
        () => throwErrorIfTruthy(
          true,
          new AppError('New Error'),
        ),
      ).toThrow('New Error');
    });
    it('should throw an error if the condition is TRUTHY', () => {
      expect(
        () => throwErrorIfTruthy(
          'value',
          new AppError('New Error'),
        ),
      ).toThrow('New Error');
    });
    it('should NOT throw an error if the condition is FALSE', () => {
      expect(
        () => throwErrorIfTruthy(
          false,
          new AppError('New Error'),
        ),
      ).not.toThrow('New Error');
    });
    it('should NOT throw an error if the condition is FALSY', () => {
      expect(
        () => throwErrorIfTruthy(
          null,
          new AppError('New Error'),
        ),
      ).not.toThrow('New Error');
    });
  });

  describe('throwErrorIfFalsy', () => {
    it('should throw an error if the value is FALSE', () => {
      expect(
        () => throwErrorIfFalsy(
          false,
          new AppError('New Error'),
        ),
      ).toThrow('New Error');
    });
    it('should throw an error if the value is FALSY', () => {
      expect(
        () => throwErrorIfFalsy(
          null,
          new AppError('New Error'),
        ),
      ).toThrow('New Error');
    });
    it('should NOT throw an error if the value is TRUE', () => {
      expect(
        () => throwErrorIfFalsy(
          true,
          new AppError('New Error'),
        ),
      ).not.toThrow('New Error');
    });
    it('should NOT throw an error if the value is TRUTHY', () => {
      expect(
        () => throwErrorIfFalsy(
          'value',
          new AppError('New Error'),
        ),
      ).not.toThrow('New Error');
    });
  });

  describe('throwAppErrorIfTruthy', () => {
    it('should throw an app error when condition is TRUTHY', () => {
      const errorMessage = 'App Error';
      let errorThrown;
      try {
        throwAppErrorIfTruthy(
          'value',
          errorMessage,
        );
      } catch (ex) {
        errorThrown = true;
        expect(ex.message).toEqual(errorMessage);
        expect(ex.isAppError).toBeTruthy();
      }
      expect(errorThrown).toBeTruthy();
    });
  });

  describe('throwAppErrorIfFalsy', () => {
    it('should throw an app error when condition is FALSY', () => {
      const errorMessage = 'App Error';
      let errorThrown;
      try {
        throwAppErrorIfFalsy(
          null,
          errorMessage,
        );
      } catch (ex) {
        errorThrown = true;
        expect(ex.message).toEqual(errorMessage);
        expect(ex.isAppError).toBeTruthy();
      }
      expect(errorThrown).toBeTruthy();
    });
  });
});
