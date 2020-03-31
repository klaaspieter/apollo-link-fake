# apollo-link-mock

Convenient Apollo mocking

## Installation

### npm

```sh
npm install --save-dev apollo-link-mock
```

### yarn

```sh
yarn add --dev apollo-link-mock
```

## Usage

It is recommended to use apollo-mock-link with [FakeQL]:

```jsx
const query = gql`
  query {
    user {
      name
      age
    }
  }
`;
const schema = introspectionFromSchema(
  buildSchema(`
  type Query {
    user: User!
  }

  type User {
    name: String!
    age: Int!
  }
`)
);
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

link.resolveMostRecentOperation((operation) =>
  fakeQL({ operation, schema })
);

expect(getByText(`mock-value-for-field-"name"`)).toBeInTheDocument();
expect(getByText("42 years old")).toBeInTheDocument();
```

[FakeQL]: https://github.com/klaaspieter/fakeql

However it is possible to return your own manual mocks:

```jsx
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
```
