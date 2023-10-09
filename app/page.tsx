"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import useAuth from "../src/components/Hooks/useAuth";
import BankBook from "../src/components/Banking/BankBook";
import Chart from "../src/components/Banking/Chart/Chart";
import Navigation from "../src/components/Layout/Navigation";
import UserProfile from "../src/components/Auth/UserProfile";
import MontlyKeywordChart from "../src/components/Banking/Chart/MontlyKeywordChart";

const Page = () => {
  const router = useRouter();
  const currentUser = useAuth();

  return (
    <>
      <Helmet>
        <title>Book Bank</title>
      </Helmet>
      <Navigation />
      <InfoContainer>
        <UserProfile />
        <BankBook
          onClick={() => router.push("/banking")}
          text="내역 보기"
          secondOnClick={() => router.push("/banking/deposit")}
          secondText="입금하기"
          transform="10%"
        >
          <span>{currentUser?.displayName || "로딩 중..."}님의 독서 통장</span>
        </BankBook>
        <MontlyKeywordChart />
      </InfoContainer>
      <Chart currentUser={currentUser} />
    </>
  );
};

export default Page;

const InfoContainer = styled.section`
  display: flex;
  gap: 12px;
  margin: 80px 24px 0;
  > article {
    height: 212px;
    border-radius: 12px;
    background-color: var(--sub-main-color);
  }
  > article:nth-of-type(1) {
    flex-grow: 1;
    flex-basis: 20%;
  }
  > div {
    height: 212px;
    flex-grow: 2;
  }
  > article:nth-of-type(2) {
    flex-basis: 20%;
    flex-grow: 1;
  }
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 16px;
    > article:nth-of-type(1) {
      order: -1;
    }
    > div {
      order: 1;
    }
  }
  @media (max-width: 600px) {
    gap: 20px;
    flex-direction: column;
    > article:nth-of-type(1) {
      width: 100%;
      padding-bottom: 20px;
    }
    > div {
      order: 0;
    }
  }
`;
