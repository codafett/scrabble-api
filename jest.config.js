module.exports = {
  testEnvironment: 'node',
  testURL: 'http://localhost',
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    '!app/graphql/graphqlTestHelper.js',
    '!app/graphql/index.js',
    '!app/config/database.js',
    '!app/apolloServer.js',
    '!app/utils/testUtils.js',
    '!app/utils/modelTestHelpers.js',
    '!app/server.js',
    '!app/db/index.js',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
    '/utils/logger',
  ],
  moduleDirectories: [
    'node_modules',
    'app',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
  ],
  testRegex: '\\.test\\.js$',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  restoreMocks: true,
};
