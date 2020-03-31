import { Operation } from "apollo-link";
import { fakeQL as originalFakeQL } from "fakeql";

type FakeQLAttributes = { operation: Operation } & Omit<
  Parameters<typeof originalFakeQL>[0],
  "document"
>;

type Result = ReturnType<typeof originalFakeQL>;
const fakeQL = (parameters: FakeQLAttributes): Result => {
  const { operation, ...other } = parameters;

  return originalFakeQL({
    document: operation.query,
    ...other,
  });
};

export { fakeQL };
