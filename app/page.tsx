"use client";

import React from "react";
import Script from "next/script";
import useAuth from "@/components/Hooks/useAuth";
import Navigation from "@/components/Layout/Navigation";
import { Helmet } from "react-helmet-async";

const Page = () => {
  const currentUser = useAuth();
  const kakaoInit = () => {
    // 페이지가 로드되면 실행
    if (!window.Kakao.isInitialized())
      window.Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY);
  };

  return (
    <>
      <Helmet>
        <title>Book Bank</title>
      </Helmet>
      <Navigation />
      <h1>메인 페이지</h1>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js"
        integrity="sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH"
        crossOrigin="anonymous"
        onLoad={kakaoInit}
        strategy="lazyOnload"
      />
    </>
  );
};

export default Page;
