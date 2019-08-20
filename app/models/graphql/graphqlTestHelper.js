import { graphql } from 'graphql';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  mockServer,
} from 'apollo-server-express';

import {
  mergedTypes,
} from './index';
import { logException } from '../../utils/logger';

export const DEFAULT_GRAPHQL_MOCK_BOOL_VALUE = false;
export const DEFAULT_GRAPHQL_MOCK_ID_VALUE = '1';
export const DEFAULT_GRAPHQL_MOCK_INT_VALUE = 1;
export const DEFAULT_GRAPHQL_MOCK_FLOAT_VALUE = 12.34;
export const DEFAULT_GRAPHQL_MOCK_STRING_VALUE = 'Name';
export const DEFAULT_GRAPHQL_MOCK_DATE_VALUE = new Date(2019, 0, 1);

export default function testTypes(cases) {
  let mockSchema;
  try {
    mockSchema = makeExecutableSchema({
      typeDefs: mergedTypes,
    });
    addMockFunctionsToSchema({
      schema: mockSchema,
      mocks: {
        Boolean: () => DEFAULT_GRAPHQL_MOCK_BOOL_VALUE,
        ID: () => DEFAULT_GRAPHQL_MOCK_ID_VALUE,
        Int: () => DEFAULT_GRAPHQL_MOCK_INT_VALUE,
        Float: () => DEFAULT_GRAPHQL_MOCK_FLOAT_VALUE,
        String: () => DEFAULT_GRAPHQL_MOCK_STRING_VALUE,
        Date: () => DEFAULT_GRAPHQL_MOCK_DATE_VALUE,
      },
    });
  } catch (ex) {
    logException(ex);
  }

  it('should have valid typeDefs', async () => {
    expect(async () => {
      const MockServer = mockServer(mergedTypes);
      await MockServer.query('{ __schema { types { name }}}');
    }).not.toThrow();
  });

  cases.forEach((testCase) => {
    const {
      id,
      query,
      variables,
      context: ctx,
      expected,
    } = testCase;

    it(`query: ${id}`, async () => {
      const result = await graphql(mockSchema, query, null, { ctx }, variables);
      expect(result).toEqual(expected);
    });
  });
}
