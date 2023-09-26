import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "@/components/Layout/Layout";
import "../style/reset.css";
import Script from "next/script";
import { HelmetProvider } from "react-helmet-async";

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
          <HelmetProvider>
            <Layout>
              <Component {...pageProps} />
              <Script
                src="https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js"
                integrity="sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH"
                crossOrigin="anonymous"
                onLoad={kakaoInit}
                strategy="lazyOnload"
              />
            </Layout>
          </HelmetProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </>
  );
}
