// 'use client'; is needed if this component is used in a Next.js App Router context.
"use client";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { ReactNode } from "react";


const GRAPHQL_URI = "https://notifyhub-sandbox-1028525309597.us-central1.run.app/graphql/";


const client = new ApolloClient({
  
  link: new HttpLink({
    uri: GRAPHQL_URI,
  }),

  
  cache: new InMemoryCache(),
});

// 2. Define the Wrapper Component.
/**
 * A wrapper component that provides the Apollo Client to the rest of the application.
 * @param {object} props 
 * @param {ReactNode} props.children - The child components to be wrapped.
 * @returns {JSX.Element}
 */
export function ApolloWrapper({ children }: { children: ReactNode }) {
  // Pass the created 'client' to the ApolloProvider.
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
