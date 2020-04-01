import testTypes, {
  DEFAULT_GRAPHQL_MOCK_BOOL_VALUE,
} from '../graphql/graphqlTestHelper';

const heartBeatTestCase = {
  id: 'HeartBeat',
  query: `
    query {
      heartBeat
    }
  `,
  variables: {},
  context: {},
  expected: {
    data: {
      heartBeat: DEFAULT_GRAPHQL_MOCK_BOOL_VALUE,
    },
  },
};

describe('system.types', () => {
  testTypes([
    heartBeatTestCase,
  ]);
});
