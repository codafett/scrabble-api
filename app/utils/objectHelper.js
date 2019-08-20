/* eslint-disable import/prefer-default-export */
export function getObjectValue(obj, valueCallback, emptyReturnValue = null) {
  return obj ? valueCallback(obj) : emptyReturnValue;
}
