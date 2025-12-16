"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/app/libs/apollo-client";
import "@/utils/i18n";

export default function ApolloProviders({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
