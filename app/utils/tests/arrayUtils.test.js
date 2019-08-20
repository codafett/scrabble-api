import {
  getDuplicateCount,
  sortByObjectValue,
  getUniqueValues,
  getFirst,
} from '../arrayUtils';
import { matchWholeWord } from '../stringUtils';

describe('getDuplicateCount', () => {
  it('should return an array of duplicates with their count', () => {
    const array = [
      {
        id: '1',
        name: '1',
        operatingSystem: 'Windows',
      },
      {
        id: '2',
        name: '2',
        operatingSystem: 'windows',
      },
      {
        id: '3',
        name: '3',
        operatingSystem: 'OS1',
      },
    ];
    const expectedResult = [
      {
        name: 'Windows',
        count: 2,
      },
      {
        name: 'OS1',
        count: 1,
      },
    ];
    const returnValue = getDuplicateCount(
      array,
      item => item.operatingSystem,
    );
    expect(returnValue.length).toEqual(2);
    expect(returnValue).toEqual(expectedResult);
  });
  it('should return an array of duplicates (including special characters) with their count', () => {
    const array = [
      {
        id: '1',
        name: '1',
        operatingSystem: 'Windows!"£$%^&*())',
      },
      {
        id: '2',
        name: '2',
        operatingSystem: 'windows!"£$%^&*())',
      },
      {
        id: '3',
        name: '3',
        operatingSystem: 'OS1',
      },
    ];
    const expectedResult = [
      {
        name: 'Windows!"£$%^&*())',
        count: 2,
      },
      {
        name: 'OS1',
        count: 1,
      },
    ];
    const returnValue = getDuplicateCount(
      array,
      item => item.operatingSystem,
    );
    expect(returnValue.length).toEqual(2);
    expect(returnValue).toEqual(expectedResult);
  });
});

describe('sortByObjectValue', () => {
  it('should put the items in order of name', () => {
    const array = [
      {
        name: 5,
      },
      {
        name: 4,
      },
      {
        name: 1,
      },
    ];
    const result = sortByObjectValue(array, a => a.name);
    expect(result[0].name).toEqual(1);
    expect(result[1].name).toEqual(4);
    expect(result[2].name).toEqual(5);
  });
  it('should put the items in order of name', () => {
    const array = [
      {
        name: 5,
      },
      {
        name: 1,
      },
      {
        name: 1,
      },
    ];
    const result = sortByObjectValue(array, a => a.name);
    expect(result[0].name).toEqual(1);
    expect(result[1].name).toEqual(1);
    expect(result[2].name).toEqual(5);
  });
});

describe('getUniqueValues', () => {
  it('should return unique list of names', () => {
    const array = [
      {
        name: 'name',
      },
      {
        name: 'NAME',
      },
      {
        name: 'NaMe',
      },
    ];
    const result = getUniqueValues(array, a => a.name);
    expect(result.length).toEqual(1);
  });
});
describe('getFirst', () => {
  it('should return null if null passed in', () => {
    const result = getFirst(null, () => true);
    expect(result).toEqual(null);
  });
  it('should return null for empty array', () => {
    const result = getFirst([], () => true);
    expect(result).toEqual(null);
  });
  it('should return null when no matching entities', () => {
    const result = getFirst([1, 2, 3, 4], () => false);
    expect(result).toEqual(null);
  });
  it('should return value for simple array or numbers', () => {
    const result = getFirst([1, 2, 3, 4], v => v === 2);
    expect(result).toEqual(2);
  });
  it('should return value for match func passed in', () => {
    const result = getFirst(['a', 'b', 'c', 'd'], v => matchWholeWord(v, 'D'));
    expect(result).toEqual('d');
  });
  it('should return object value for match func passed in', () => {
    const result = getFirst([
      {
        name: 'client1',
      },
      {
        name: 'client2',
      },
    ], v => matchWholeWord(v.name, 'CLIENT1'));
    expect(result).toEqual({ name: 'client1' });
  });
});
