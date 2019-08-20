/* eslint-disable import/prefer-default-export */
export function escape(str) {
  return String(str).replace(/([.*+?=^!:${}()|[\]/\\])/g, '\\$1');
}

export function matchWholeWordRegEx(valuetoMatch, flags = 'i') {
  return new RegExp(`^${escape((valuetoMatch || '').trim())}$`, flags);
}

export function matchWholeWord(valuetoMatch, valueToCheck, flags = 'i') {
  if (!valuetoMatch && valueToCheck) {
    return false;
  }
  const regex = matchWholeWordRegEx(valuetoMatch, flags);
  return regex.test((valueToCheck || '').trim());
}

export function matchStartOfWordRegEx(valuetoMatch, flags = 'i') {
  return new RegExp(`^${escape((valuetoMatch || '').trim())}`, flags);
}

export function matchStartOfWord(valuetoMatch, valueToCheck, flags = 'i') {
  if (!valuetoMatch && valueToCheck) {
    return false;
  }
  const regex = matchStartOfWordRegEx(valuetoMatch, flags);
  return regex.test((valueToCheck || '').trim());
}

export function matchInWordRegEx(valuetoMatch, flags = 'i') {
  return new RegExp(`${escape((valuetoMatch || '').trim())}`, flags);
}

export function matchInWord(valuetoMatch, valueToCheck, flags = 'i') {
  if (!valuetoMatch && valueToCheck) {
    return false;
  }
  const regex = matchInWordRegEx(valuetoMatch, flags);
  return regex.test((valueToCheck || '').trim());
}

export function matchEndOfWordRegEx(valuetoMatch, flags = 'i') {
  return new RegExp(`${escape((valuetoMatch || '').trim())}$`, flags);
}

export function matchEndOfWord(valuetoMatch, valueToCheck, flags = 'i') {
  if (!valuetoMatch && valueToCheck) {
    return false;
  }
  const regex = matchEndOfWordRegEx(valuetoMatch, flags);
  return regex.test((valueToCheck || '').trim());
}

export function getSearchRegEx(searchString) {
  const safeSearchString = searchString || '';
  if (safeSearchString.startsWith('*') && safeSearchString.endsWith('*')) {
    return matchInWordRegEx(safeSearchString.substring(1, safeSearchString.length - 1).trim());
  }
  if (safeSearchString.startsWith('*')) {
    return matchEndOfWordRegEx(safeSearchString.substring(1).trim());
  }
  if (safeSearchString.endsWith('*')) {
    return matchStartOfWordRegEx(safeSearchString.substring(0, safeSearchString.length - 1).trim());
  }
  return matchInWordRegEx(safeSearchString.trim());
}
