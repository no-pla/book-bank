"use client";

import { PropsWithChildren } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function Providers({ children }: PropsWithChildren) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>{children}</HelmetProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default Providers;
