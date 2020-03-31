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

This example is recommended usage which uses [FakeQL] and a [configured GraphQL project][graphql-config]. For more advanced usage take a look at the [full API reference][API reference]

With the following schema is configured:

```gql
type Query {
  user: User!
}

type User {
  name: String!
  age: Int!
}
```

And this component under test:

```typescript
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
```

This is an example of a test using `apollo-mock-link`:

```typescript
const { getByText } = render(
  <MockedProvider addTypename={false} link={link}>
    <Component />
  </MockedProvider>
);

expect(getByText("Loading…")).toBeInTheDocument();

link.resolveMostRecentOperation((operation) =>
  fakeQL({ operation })
);

expect(getByText(`mock-value-for-field-"name"`)).toBeInTheDocument();
expect(getByText("42 years old")).toBeInTheDocument();
```

# API reference

- `pendingOperations` - Get all operations executed so far that have not been resolved or rejected.
- `resolveMostRecentOperation` - Given a `Result` or a function that takes an `Operation` and returns `Result` resolves the operation with the provided `Result`. `Result` is defined as `Record<string, any>` which translates to any `{}`. Throws an error when there are no pending operations.
- `findOperation` - Given a predicate `(Operation) -> boolean` returns the first operation for which the predicate is true. Throws an error if no matching operation is found.

[API reference]: #api-reference
[FakeQL]: https://github.com/klaaspieter/fakeql
[graphql-config]: https://github.com/kamilkisiela/graphql-config
