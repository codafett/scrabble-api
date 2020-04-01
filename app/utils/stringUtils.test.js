import {
  matchWholeWord,
  matchWholeWordRegEx,
  matchStartOfWordRegEx,
  matchStartOfWord,
  matchInWordRegEx,
  matchInWord,
  matchEndOfWordRegEx,
  matchEndOfWord,
  getSearchRegEx,
} from './stringUtils';

describe('stringUtils', () => {
  describe('matchWholeWordRegEx', () => {
    it('should match regex', () => {
      const nameTest = /^name$/i;
      const newTest = matchWholeWordRegEx('name');
      expect(nameTest).toEqual(newTest);
    });
  });

  describe('matchWholeWord', () => {
    it('should return false if valueToMatch is null', () => {
      const result = matchWholeWord(null, 'dda');
      expect(result).toBeFalsy();
    });
    it('should return false if valueToCheck is null', () => {
      const result = matchWholeWord('a', null);
      expect(result).toBeFalsy();
    });
    it('should match single letter', () => {
      const result = matchWholeWord('a', 'a');
      expect(result).toBeTruthy();
    });
    it('should match entire string', () => {
      const result = matchWholeWord('name', 'name');
      expect(result).toBeTruthy();
    });
    it('should match entire string removing white space from value to check', () => {
      const result = matchWholeWord('name', ' name ');
      expect(result).toBeTruthy();
    });
    it('should match entire string removing white space from value to match', () => {
      const result = matchWholeWord(' name ', 'name');
      expect(result).toBeTruthy();
    });
    it('should match entire string case insensitive', () => {
      const result = matchWholeWord('name', 'NaMe');
      expect(result).toBeTruthy();
    });
    it('should match entire strings with special characters', () => {
      const result = matchWholeWord('name!"£$%^&*()', 'name!"£$%^&*()');
      expect(result).toBeTruthy();
    });
    it('should NOT match partial strings', () => {
      const result = matchWholeWord('name 1', 'name 2');
      expect(result).toBeFalsy();
    });
    it('should NOT match partial strings with special characters', () => {
      const result = matchWholeWord('name 1!"£$%^&*()', 'name 2!"£$%^&*()');
      expect(result).toBeFalsy();
    });
  });

  describe('matchStartOfWordRegEx', () => {
    it('should match regex', () => {
      const nameTest = /^name/i;
      const regex = matchStartOfWordRegEx('name');
      expect(regex).toEqual(nameTest);
    });
  });

  describe('matchStartOfWord', () => {
    it('should return false if valueToMatch is null', () => {
      const result = matchStartOfWord(null, 'dda');
      expect(result).toBeFalsy();
    });
    it('should return false if valueToCheck is null', () => {
      const result = matchStartOfWord('a', null);
      expect(result).toBeFalsy();
    });
    it('should match single letter', () => {
      const result = matchStartOfWord('a', 'abc');
      expect(result).toBeTruthy();
    });
    it('should match start of string', () => {
      const result = matchStartOfWord('name', 'namebc');
      expect(result).toBeTruthy();
    });
    it('should match start of string removing white space from value to check', () => {
      const result = matchStartOfWord('name', ' namebc ');
      expect(result).toBeTruthy();
    });
    it('should match start of string removing white space from value to match', () => {
      const result = matchStartOfWord(' name ', 'namebc');
      expect(result).toBeTruthy();
    });
    it('should match start of string case insensitive', () => {
      const result = matchStartOfWord('name', 'NaMebc');
      expect(result).toBeTruthy();
    });
    it('should match start of strings with special characters', () => {
      const result = matchStartOfWord('name!"£$%^&*()', 'name!"£$%^&*()bc');
      expect(result).toBeTruthy();
    });
    it('should NOT match different strings', () => {
      const result = matchStartOfWord('name 1', 'name 2');
      expect(result).toBeFalsy();
    });
    it('should NOT match different strings with special characters', () => {
      const result = matchStartOfWord('name 1!"£$%^&*()', 'name 2!"£$%^&*()bc');
      expect(result).toBeFalsy();
    });
  });

  describe('matchInWordRegEx', () => {
    it('should match regex', () => {
      const nameTest = /name/i;
      const regex = matchInWordRegEx('name');
      expect(regex).toEqual(nameTest);
    });
  });

  describe('matchInWord', () => {
    it('should return false if valueToMatch is null', () => {
      const result = matchInWord(null, 'dda');
      expect(result).toBeFalsy();
    });
    it('should return false if valueToCheck is null', () => {
      const result = matchInWord('a', null);
      expect(result).toBeFalsy();
    });
    it('should match single letter', () => {
      const result = matchInWord('a', 'ddabc');
      expect(result).toBeTruthy();
    });
    it('should match in  string', () => {
      const result = matchInWord('name', 'abnamebc');
      expect(result).toBeTruthy();
    });
    it('should match in string removing white space from value to check', () => {
      const result = matchInWord('name', ' abnamebc ');
      expect(result).toBeTruthy();
    });
    it('should match in string removing white space from value to match', () => {
      const result = matchInWord(' name ', 'abnamebc');
      expect(result).toBeTruthy();
    });
    it('should match in string case insensitive', () => {
      const result = matchInWord('name', 'abNaMebc');
      expect(result).toBeTruthy();
    });
    it('should match in strings with special characters', () => {
      const result = matchInWord('name!"£$%^&*()', 'abname!"£$%^&*()bc');
      expect(result).toBeTruthy();
    });
    it('should NOT match different strings', () => {
      const result = matchInWord('name 1', 'name 2');
      expect(result).toBeFalsy();
    });
    it('should NOT match different strings with special characters', () => {
      const result = matchInWord('name 1!"£$%^&*()', 'abname 2!"£$%^&*()bc');
      expect(result).toBeFalsy();
    });
  });

  describe('matchEndOfWordRegEx', () => {
    it('should match regex', () => {
      const nameTest = /name$/i;
      const regex = matchEndOfWordRegEx('name');
      expect(regex).toEqual(nameTest);
    });
  });

  describe('matchEndOfWord', () => {
    it('should return false if valueToMatch is null', () => {
      const result = matchEndOfWord(null, 'dda');
      expect(result).toBeFalsy();
    });
    it('should return false if valueToCheck is null', () => {
      const result = matchEndOfWord('a', null);
      expect(result).toBeFalsy();
    });
    it('should match single letter', () => {
      const result = matchEndOfWord('a', 'dda');
      expect(result).toBeTruthy();
    });
    it('should match end of string', () => {
      const result = matchEndOfWord('name', 'abname');
      expect(result).toBeTruthy();
    });
    it('should match end of string removing white space from value to check', () => {
      const result = matchEndOfWord('name', ' abname ');
      expect(result).toBeTruthy();
    });
    it('should match end of string removing white space from value to match', () => {
      const result = matchEndOfWord(' name ', 'abname');
      expect(result).toBeTruthy();
    });
    it('should match end of string case insensitive', () => {
      const result = matchEndOfWord('name', 'abNaMe');
      expect(result).toBeTruthy();
    });
    it('should match end of strings with special characters', () => {
      const result = matchEndOfWord('name!"£$%^&*()', 'abname!"£$%^&*()');
      expect(result).toBeTruthy();
    });
    it('should NOT match different strings', () => {
      const result = matchEndOfWord('name 1', 'name 2');
      expect(result).toBeFalsy();
    });
    it('should NOT match different strings with special characters', () => {
      const result = matchEndOfWord('name 1!"£$%^&*()', 'abname 2!"£$%^&*()');
      expect(result).toBeFalsy();
    });
  });

  describe('getSearchRegEx', () => {
    it('should return a "matchInWordRegEx" for a plain string', () => {
      const searchName = 'abc';
      const expected = matchInWordRegEx(searchName);
      const result = getSearchRegEx(searchName);
      expect(result).toEqual(expected);
    });
    it('should return a "matchInWordRegEx" match for a string starting and ending with *', () => {
      const searchName = '*abc*';
      const expected = matchInWordRegEx('abc');
      const result = getSearchRegEx(searchName);
      expect(result).toEqual(expected);
    });
    it('should return a "matchStartOfWordRegEx" match for string starting with *', () => {
      const searchName = 'abc*';
      const expected = matchStartOfWordRegEx('abc');
      const result = getSearchRegEx(searchName);
      expect(result).toEqual(expected);
    });
    it('should return a "matchEndOfWordRegEx" match for string ending with *', () => {
      const searchName = '*abc';
      const expected = matchEndOfWordRegEx('abc');
      const result = getSearchRegEx(searchName);
      expect(result).toEqual(expected);
    });
    it('should return a "matchInWordRegEx" and escape any * in the middle of a string', () => {
      const searchName = 'a*b*c';
      const expected = matchInWordRegEx('a*b*c');
      const result = getSearchRegEx(searchName);
      expect(result).toEqual(expected);
    });
    it('should return a "matchInWordRegEx" and escape any * in the middle of a string', () => {
      const searchName = '*a*b*c*';
      const expected = matchInWordRegEx('a*b*c');
      const result = getSearchRegEx(searchName);
      expect(result).toEqual(expected);
    });
    it('should return a "matchStartOfWordRegEx" and escape any * in the middle of a string', () => {
      const searchName = 'a*b*c*';
      const expected = matchStartOfWordRegEx('a*b*c');
      const result = getSearchRegEx(searchName);
      expect(result).toEqual(expected);
    });
    it('should return a "matchEndOfWordRegEx" and escape any * in the middle of a string', () => {
      const searchName = '*a*b*c';
      const expected = matchEndOfWordRegEx('a*b*c');
      const result = getSearchRegEx(searchName);
      expect(result).toEqual(expected);
    });
  });
});
