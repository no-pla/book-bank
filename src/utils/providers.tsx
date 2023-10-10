"use client";

import Navigation from "@/components/Layout/Navigation";
import styled from "@emotion/styled";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          {pathname !== "/login" && pathname !== "/register" ? (
            <>
              <Navigation />
              <Container>{children}</Container>
            </>
          ) : (
            <>{children}</>
          )}
        </HelmetProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default Providers;

const Container = styled.main`
  margin: 80px 24px 0;
`;
