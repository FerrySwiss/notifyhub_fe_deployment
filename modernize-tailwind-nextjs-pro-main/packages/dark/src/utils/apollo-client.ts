import { ApolloClient, createHttpLink, InMemoryCache,  } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://graphqlzero.almansi.me/api", 
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
