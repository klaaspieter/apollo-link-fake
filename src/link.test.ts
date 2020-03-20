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
  });
});