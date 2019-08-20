import config from '.';

describe('config', () => {
  it('should have property for port', () => {
    expect(config.port).toBeDefined();
    expect(config.port).toEqual(process.env.PORT);
  });
  it('should have property for testPort', () => {
    expect(config.testPort).toBeDefined();
    expect(config.testPort).toEqual(process.env.TEST_PORT);
  });
  it('should have property for db', () => {
    expect(config.db).toBeDefined();
    expect(config.db).toEqual(process.env.DB);
  });
  it('should have property for secret', () => {
    expect(config.secret).toBeDefined();
    expect(config.secret).toEqual(process.env.JWT_TOKEN_SECRET);
  });
  it('should have property for logLevel', () => {
    expect(config.logLevel).toBeDefined();
    expect(config.logLevel).toEqual(process.env.LOG_LEVEL);
  });
});
