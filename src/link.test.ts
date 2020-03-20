import { MockLink } from "./index";
import { execute } from "apollo-link";
import gql from "graphql-tag";

describe("MockLink", () => {
  describe("resolveMostRecentOperation", () => {
    it("can respond with mocked data", done => {
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
          age: 5
        }
      };

      execute(link, { query }).subscribe({
        next: r => {
          expect(r).toEqual(result);
        },
        complete: () => {
          done();
        }
      });
      link.resolveMostRecentOperation(result);
    });

    it("can provided the operation to respond to", done => {
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
          age: 5
        }
      };

      execute(link, { query }).subscribe({
        next: r => {
          expect(r).toEqual(result);
        },
        complete: () => {
          done();
        }
      });
      link.resolveMostRecentOperation(operation => result);
    });

    it("throws when there are no more operations", () => {
      const link = new MockLink();
      expect(() => link.resolveMostRecentOperation({})).toThrow(
        "MockLink: There are no pending operations"
      );
    });
  });
});
