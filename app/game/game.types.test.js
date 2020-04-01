import testTypes, {
  DEFAULT_GRAPHQL_MOCK_STRING_VALUE, DEFAULT_GRAPHQL_MOCK_ID_VALUE,
} from '../graphql/graphqlTestHelper';

const gamesTestCase = {
  id: 'games',
  query: `
    query {
      games {
        _id
        name
        users {
          _id
          firstName
          lastName
        }
      }
    }
  `,
  variables: {},
  context: {},
  expected: {
    data: {
      games: [
        {
          _id: DEFAULT_GRAPHQL_MOCK_ID_VALUE,
          name: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
          users: [
            {
              _id: DEFAULT_GRAPHQL_MOCK_ID_VALUE,
              firstName: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
              lastName: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
            },
            {
              _id: DEFAULT_GRAPHQL_MOCK_ID_VALUE,
              firstName: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
              lastName: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
            },
          ],
        },
        {
          _id: DEFAULT_GRAPHQL_MOCK_ID_VALUE,
          name: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
          users: [
            {
              _id: DEFAULT_GRAPHQL_MOCK_ID_VALUE,
              firstName: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
              lastName: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
            },
            {
              _id: DEFAULT_GRAPHQL_MOCK_ID_VALUE,
              firstName: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
              lastName: DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
            },
          ],
        },
      ],
    },
  },
};

describe('game.types', () => {
  testTypes([
    gamesTestCase,
  ]);
});
