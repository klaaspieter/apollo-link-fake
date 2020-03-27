import { GraphQLSchema, IntrospectionQuery, ValidationRule } from "graphql";
import { Operation } from "apollo-link";
import { fakeQL as originalFakeQL, MockResolverMap } from "fakeql";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Result = Record<string, any>;

export interface FakeQLProps {
  operation: Operation;
  schema: GraphQLSchema | IntrospectionQuery;
  resolvers?: MockResolverMap;
  validationRules?: ValidationRule[];
}
const fakeQL = ({
  operation,
  schema,
  resolvers,
  validationRules,
}: FakeQLProps): Result => {
  return originalFakeQL({
    document: operation.query,
    schema,
    resolvers,
    validationRules,
  });
};

export { fakeQL };
