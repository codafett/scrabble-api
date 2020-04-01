import { getObjectValue } from './objectHelper';

describe('objectHelper', () => {
  it('should return null if obj passed is null', () => {
    const returnValue = getObjectValue(null, obj => obj.id);
    expect(returnValue).toEqual(null);
  });
  it('should return default value if obj passed is null', () => {
    const returnValue = getObjectValue(null, obj => obj.id, '1234');
    expect(returnValue).toEqual('1234');
  });
  it('should return obj value value if obj passed is not null', () => {
    const returnValue = getObjectValue({ id: '4321' }, obj => obj.id, null);
    expect(returnValue).toEqual('4321');
  });
  it('should return obj value value if obj passed is not null and default passed in ', () => {
    const returnValue = getObjectValue({ id: '4321' }, obj => obj.id, '1234');
    expect(returnValue).toEqual('4321');
  });
});
