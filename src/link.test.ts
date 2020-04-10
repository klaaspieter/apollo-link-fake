import { MockLink } from "./index";
import { execute } from "apollo-link";
import gql from "graphql-tag";

describe("MockLink", () => {
  describe("pendingOperations", () => {
    it("returns all operations waiting to be resolved/rejected", () => {
      const query1 = gql`
        query {
          user {
            name
            age
          }
        }
      `;
      const query2 = gql`
        query {
          teams {
            name
          }
        }
      `;
      const link = new MockLink();

      execute(link, { query: query1 }).subscribe({});
      execute(link, { query: query2 }).subscribe({});

      expect(link.pendingOperations.length).toBe(2);
    });

    it("does not return operations that have been resolved/rejected", () => {
      const query1 = gql`
        query {
          user {
            name
            age
          }
        }
      `;
      const query2 = gql`
        query {
          teams {
            name
          }
        }
      `;
      const link = new MockLink();
      execute(link, { query: query1 }).subscribe({});
      link.resolveMostRecentOperation({ user: { name: "name", age: 42 } });

      execute(link, { query: query2 }).subscribe({});

      expect(link.pendingOperations.length).toBe(1);
    });
  });

  describe("mostRecentOperation", () => {
    it("returns the most recent operation", () => {
      const query = gql`
        query me {
          user {
            name
            age
          }
        }
      `;
      const link = new MockLink();

      execute(link, { query }).subscribe({});

      expect(link.mostRecentOperation.operationName).toBe("me");
    });

    it("throws an error when there are no pending operations", () => {
      const link = new MockLink();

      expect(() => {
        link.mostRecentOperation;
      }).toThrow("MockLink: There are no pending operations");
    });
  });

  describe("findOperation", () => {
    it("finds the first operation that matches", () => {
      const query = gql`
        query me {
          user {
            name
            age
          }
        }
      `;
      const link = new MockLink();
      execute(link, { query }).subscribe({});

      const operation = link.findOperation(
        (operation) => operation.operationName === "me"
      );

      expect(operation).toBeDefined();
    });

    it("throws when there are no macthing operations", () => {
      const link = new MockLink();

      expect(() => {
        link.findOperation(() => false);
      }).toThrow(
        "MockLink: Operation was not found in the list of pending operations"
      );
    });
  });

  describe("resolveMostRecentOperation", () => {
    it("can respond with mocked data", (done) => {
      const query = gql`
        query {
          user {
            name
            age
          }
        }
      `;
      const link = new MockLink();
      const result = {
        user: {
          name: "test",
          age: 5,
        },
      };

      execute(link, { query }).subscribe({
        next: (r) => {
          expect(r).toEqual({ data: result });
        },
        complete: () => {
          done();
        },
      });
      link.resolveMostRecentOperation(result);
    });

    it("can provide the operation to respond to", (done) => {
      const query = gql`
        query me {
          user {
            name
            age
          }
        }
      `;
      const link = new MockLink();
      const result = {
        user: {
          name: "test",
          age: 5,
        },
      };

      execute(link, { query }).subscribe({
        next: (r) => {
          expect(r).toEqual({ data: result });
        },
        complete: () => {
          done();
        },
      });
      link.resolveMostRecentOperation((operation) => {
        expect(operation.operationName).toBe("me");
        return result;
      });
    });

    it("throws when there are no more operations", () => {
      const link = new MockLink();
      expect(() => link.resolveMostRecentOperation({})).toThrow(
        "MockLink: There are no pending operations"
      );
    });
  });

  describe("rejectMostRecentOperation", () => {
    it("can respond with an error", (done) => {
      const query = gql`
        query {
          user {
            name
            age
          }
        }
      `;
      const error = new Error("I failed you");
      const link = new MockLink();

      execute(link, { query }).subscribe({
        error: (e) => {
          expect(e).toEqual(error);
          done();
        },
      });
      link.rejectMostRecentOperation(error);
    });

    it("can provide the operation to respond to", (done) => {
      const query = gql`
        query me {
          user {
            name
            age
          }
        }
      `;
      const error = new Error("I failed you");
      const link = new MockLink();

      execute(link, { query }).subscribe({
        error: (e) => {
          expect(e).toEqual(error);
          done();
        },
      });
      link.rejectMostRecentOperation((operation) => {
        expect(operation.operationName).toBe("me");
        return error;
      });
    });

    it("throws when there are no more operations", () => {
      const link = new MockLink();
      expect(() => link.rejectMostRecentOperation(new Error())).toThrow(
        "MockLink: There are no pending operations"
      );
    });
  });

  describe("PendingOperation", () => {
    it("can be resolved", (done) => {
      const query = gql`
        query {
          user {
            name
            age
          }
        }
      `;
      const link = new MockLink();
      const result = {
        user: {
          name: "test",
          age: 5,
        },
      };

      execute(link, { query }).subscribe({
        next: (r) => {
          expect(r).toEqual({ data: result });
          done();
        },
      });

      link.mostRecentOperation.resolve(result);
      expect(link.pendingOperations.length).toBe(0);
    });

    it("can be rejected", (done) => {
      const query = gql`
        query {
          user {
            name
            age
          }
        }
      `;
      const link = new MockLink();
      const error = new Error();

      execute(link, { query }).subscribe({
        error: (e) => {
          expect(e).toEqual(error);
          done();
        },
      });

      link.mostRecentOperation.reject(error);
      expect(link.pendingOperations.length).toBe(0);
    });
  });
});
