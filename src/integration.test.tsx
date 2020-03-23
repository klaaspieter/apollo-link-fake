/**
 * @jest-environment jsdom
 */

import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/react-testing";
import { MockLink } from "./index";

describe("MockedProvider integration", () => {
  it("works with Apollo's MockedProvider", () => {
    const query = gql`
      query {
        user {
          name
          age
        }
      }
    `;
    const link = new MockLink();
    const Component = (): JSX.Element => {
      const { loading, data } = useQuery(query);

      if (!data || loading) {
        return <>Loading…</>;
      }

      return (
        <div>
          Hello my name is <span>{data.user.name}</span> and I am{" "}
          <span>{data.user.age} years old</span>
        </div>
      );
    };

    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Component />
      </MockedProvider>
    );

    expect(getByText("Loading…")).toBeInTheDocument();

    link.resolveMostRecentOperation({
      user: {
        name: "Wei Shi Lindon Arelius",
        age: 18,
      },
    });

    expect(getByText("Wei Shi Lindon Arelius")).toBeInTheDocument();
    expect(getByText("18 years old")).toBeInTheDocument();
  });
});
