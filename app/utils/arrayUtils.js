import { matchWholeWordRegEx } from './stringUtils';

export function getDuplicateCount(array, fieldCb) {
  const unmatchedValues = [];
  array
    .forEach((item) => {
      let unmatchedRecord;
      const value = fieldCb(item);
      if (typeof value === 'string' || value instanceof String) {
        [unmatchedRecord] = unmatchedValues
          .filter(u => u.name.match(matchWholeWordRegEx(value)));
      } else {
        [unmatchedRecord] = unmatchedValues
          .filter(u => u.name === value);
      }
      if (unmatchedRecord) {
        unmatchedRecord.count += 1;
      } else {
        unmatchedValues.push({
          name: fieldCb(item),
          count: 1,
        });
      }
    });
  return unmatchedValues;
}

export function getUniqueValues(array, fieldCb) {
  return [...new Set(array.map((md) => {
    let value = fieldCb(md);
    if (typeof value === 'string' || value instanceof String) {
      value = value.toLowerCase();
    }
    return value;
  }))];
}

export function sortByObjectValue(array, sortFieldCb) {
  return array.sort((a, b) => {
    const fieldA = sortFieldCb(a);
    const fieldB = sortFieldCb(b);
    if (fieldA < fieldB) {
      return -1;
    }
    if (fieldA > fieldB) {
      return 1;
    }
    return 0;
  });
}

export function getFirst(array, matchCb) {
  let result = null;
  if (array) {
    array.some((v) => {
      if (matchCb(v)) {
        result = v;
      }
      return result;
    });
  }
  return result;
}
