"use client";

import { useEffect } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import { selectBookState, userDirectFormState } from "@/share/atom";
import SearchForm from "@/components/Banking/Form/SearchForm";
import ReviewForm from "@/components/Banking/Form/ReviewForm";

const Page = () => {
  const resetList = useResetRecoilState(selectBookState);
  const resetDirectList = useResetRecoilState(userDirectFormState);
  const targetBookData = useRecoilValue(selectBookState);
  const userDirectFormData = useRecoilValue(userDirectFormState);

  useEffect(() => {
    resetList();
    resetDirectList();
  }, []);

  return (
    <DepositContainer
      show={
        Object.keys(targetBookData).length > 0 || userDirectFormData
          ? "block"
          : "none"
      }
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Book Bank / 입금하기</title>
        <meta name="description" content="독서 기록 남기기" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="독서, 독후감, 독서 기록, 독서기록장" />
      </Helmet>
      <SearchForm />
      <ReviewForm />
    </DepositContainer>
  );
};

export default Page;

const DepositContainer = styled.section<{ show: string }>`
  display: flex;
  height: 100%;
  gap: 20px;
  width: 100%;
  position: relative;
  > article {
    width: 50%;
    background-color: #bfb0d1;
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;
    display: block;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  @media (max-width: 600px) {
    > article:first-of-type {
      width: 100%;
    }
    > article:last-of-type {
      width: 100%;
      display: ${(props) => props.show};
    }
  }
`;
