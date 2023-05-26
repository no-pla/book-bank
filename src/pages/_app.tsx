import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "@/components/Layout/Layout";
import useAuth from "@/components/Hooks/useAuth";
import "../style/reset.css";
import Script from "next/script";
import { Dongle } from "@next/font/google";
import { Global, css } from "@emotion/react";

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

const poorStory = Dongle({
  weight: "300",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const currentUser = useAuth();

  const kakaoInit = () => {
    // 페이지가 로드되면 실행
    if (!window.Kakao.isInitialized())
      window.Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY);
  };

  return (
    <>
      <Global
        styles={css`
          html {
            font-family: ${poorStory.style.fontFamily};
          }
          * {
            font-family: inherit;
          }
        `}
      />
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
