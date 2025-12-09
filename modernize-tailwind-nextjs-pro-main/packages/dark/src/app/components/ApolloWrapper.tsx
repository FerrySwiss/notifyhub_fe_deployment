"use client";

import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ReactNode, useEffect, useState } from "react";

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

    if (!endpoint) {
      console.error("❌ GraphQL endpoint missing — set NEXT_PUBLIC_GRAPHQL_ENDPOINT in .env");
      return;
    }

    const httpLink = createHttpLink({
      uri: endpoint.endsWith("/") ? endpoint : `${endpoint}/`,  // ensure trailing slash
    });

    const authLink = setContext((_, { headers }) => {
      const token = localStorage.getItem("notifyhub_access_token");
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    setClient(
      new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
        defaultOptions: {
          query: { fetchPolicy: "network-only" }, // avoid cached old data
          watchQuery: { fetchPolicy: "network-only" },
        },
      })
    );
  }, []); // runs once on mount

  // Wait for client initialization
  if (!client) return null;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
