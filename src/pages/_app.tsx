import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "@/components/Layout/Layout";
import "../style/reset.css";
import Script from "next/script";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

declare global {
  // Kakao 전역에서 접근 가능하도록
  interface Window {
    Kakao: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const kakaoInit = () => {
    // 페이지가 로드되면 실행
    if (!window.Kakao.isInitialized())
      window.Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY);
  };

  return (
    <>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
            <Script
              src="https://developers.kakao.com/sdk/js/kakao.js"
              onLoad={kakaoInit}
            />
          </Layout>
        </QueryClientProvider>
      </RecoilRoot>
    </>
  );
}
