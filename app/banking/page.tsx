"use client";

import BankBook from "@/components/Banking/BankBook";
import ReviewDetailItem from "@/components/Banking/ReviewDetailItem";
import ReviewItem from "@/components/Banking/ReviewItem";
import useAuth from "@/components/Hooks/useAuth";
import useUserDepositList from "@/components/Hooks/useUserDepositList";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useRecoilState, useResetRecoilState } from "recoil";

export interface BookData {
  id: string;
  uid: string;
  title: string;
  authors: string[];
  publisher: string;
  price: number;
  thumbnail: string;
  review: string;
  createdAt: number;
  createdYear: number;
  createdMonth: number;
  createdDay: number;
}

const Page = () => {
  const currentUser = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const userReviewList = useUserDepositList(currentUser?.uid);
  const [edit, setEdit] = useRecoilState(isFormEdit);
  const resetMyBookData = useResetRecoilState(selectMyBookState);

  const kakaoInit = () => {
    // 페이지가 로드되면 실행
    if (!window.Kakao.isInitialized())
      window.Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY);
  };

  const totalAmount =
    userReviewList
      ?.reduce((cur: number, acc: BookData) => {
        return cur + acc.price;
      }, 0)
      .toLocaleString("ko-KR") || 0;

  useEffect(() => {
    queryClient.invalidateQueries("getMyBookList");
    resetMyBookData();
    if (edit) {
      setEdit(false);
    }
  }, []);

  const onShare = async () => {
    await window.Kakao.Share.sendCustom({
      templateId: 94039,
      templateArgs: {
        totalBook: userReviewList?.length || 0,
        totalAmount,
        userProfile: currentUser?.photoURL,
        userName: currentUser?.displayName,
      },
    });
  };

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js"
        integrity="sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH"
        crossOrigin="anonymous"
        onLoad={kakaoInit}
        strategy="lazyOnload"
      />
      <Section>
        <DataItemContainer>
          <BankBook
            onClick={() => onShare()}
            text="공유하기"
            secondOnClick={() => router.push("/banking/deposit")}
            secondText="입금하기"
            transform="10%"
            disabled={window.Kakao === undefined}
          />
          <ReviewItem />
        </DataItemContainer>
        <ReviewDetailItem />
      </Section>
    </>
  );
};

export default Page;

const Section = styled.section`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 20px;
  position: relative;
`;

// 리뷰 인피티니 스크롤
const DataItemContainer = styled.article`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;
