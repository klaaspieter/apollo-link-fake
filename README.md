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
