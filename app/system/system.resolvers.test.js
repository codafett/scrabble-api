import systemResolvers from './system.resolvers';

describe('systemResolvers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('heartBeat', () => {
    it('should return true', async () => {
      const result = await systemResolvers.Query.heartBeat();
      expect(result).toBeTruthy();
    });
  });
});
