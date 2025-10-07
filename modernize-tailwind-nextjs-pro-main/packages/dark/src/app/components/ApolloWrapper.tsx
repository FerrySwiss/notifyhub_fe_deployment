"use client";

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from "@apollo/client";
import { ReactNode } from "react";

console.log("ApolloProvider", ApolloProvider);

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://graphqlzero.almansi.me/api",
  }),
  cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}