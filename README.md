# apollo-link-fake

Convenient Apollo mocking

## Installation

### npm

```sh
npm install --save-dev apollo-link-fake
```

### yarn

```sh
yarn add --dev apollo-link-fake
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

This is an example of a test using `apollo-link-fake`:

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

## Types

- `Result` - is defined as `Record<string, unknown>` which translates to any `{}`.

## Methods

- `pendingOperations` - Get all operations executed so far that have not been resolved or rejected.
- `mostRecentOperation` - Return the most recent operation. Throws an error when there are no pending operations.
- `resolveMostRecentOperation` - Given a `Result` or a function `Operation => Result`, resolves the operation with the provided `Result`. Throws an error when there are no pending operations.
- - `rejectMostRecentOperation` - Given a `Error` or a function `Operation => Error`, rejects the operation with the provided `Error`. Throws an error when there are no pending operations.
- `findOperation` - Given a predicate `(Operation) -> boolean` returns the first operation for which the predicate is true. Throws an error if no matching operation is found.

## PendingOperation

Some methods return a `PendingOperation` which has the following API:

- resolve - Resolves the operation with the provided `Result`
- reject - Rejects the operation with the provided `Error`

[API reference]: #api-reference
[FakeQL]: https://github.com/klaaspieter/fakeql
[graphql-config]: https://github.com/kamilkisiela/graphql-config
