import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { ReactQueryDevtools } from "react-query/devtools";
import Layout from "@/components/Layout/Layout";
import "../style/reset.css";
import useAuth from "@/components/Hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const currentUser = useAuth();

  return (
    <>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} currentUser={currentUser} />
          </Layout>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </RecoilRoot>
    </>
  );
}
