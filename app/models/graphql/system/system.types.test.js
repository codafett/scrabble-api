import testTypes, {
  DEFAULT_GRAPHQL_MOCK_ID_VALUE,
  DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
  DEFAULT_GRAPHQL_MOCK_BOOL_VALUE,
  DEFAULT_GRAPHQL_MOCK_INT_VALUE,
} from '../graphqlTestHelper';

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
