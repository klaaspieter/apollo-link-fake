import { GraphQLSchema, IntrospectionQuery } from "graphql";
import { Operation } from "apollo-link";
import { fakeQL as originalFakeQL } from "fakeql";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Result = Record<string, any>;

export interface FakeQLProps {
  operation: Operation;
  schema: GraphQLSchema | IntrospectionQuery;
}
const fakeQL = ({ operation, schema }: FakeQLProps): Result => {
  return originalFakeQL({ document: operation.query, schema });
};

export { fakeQL };
