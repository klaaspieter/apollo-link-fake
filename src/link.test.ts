import { MockLink } from "./index";
import { execute } from "apollo-link";
import gql from "graphql-tag";

describe("MockLink", () => {
  it("responds with mocked data", done => {
    const query = gql`
      query {
        user {
          name
          age
        }
      }
    `;
    const link = new MockLink();

    execute(link, { query }).subscribe({
      next: result => {
        expect(result).toEqual({
          user: {
            name: 'mock-value-for-field-"name"',
            age: 'mock-value-for-field-"age"'
          }
        });
        done();
      }
    });
  });
});
