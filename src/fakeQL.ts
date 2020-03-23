import { Operation } from "apollo-link";
import { fakeQL } from "fakeql";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Result = Record<string, any>;

const x = (operation: Operation): Result => {
  return fakeQL({ document: operation.query });
};

export { x as fakeQL };
