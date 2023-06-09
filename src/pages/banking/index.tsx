import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import useUser from "@/components/Hooks/useUser";
import ReviewItem from "@/components/Banking/ReviewItem";
import ReviewDetailItem from "@/components/Banking/ReviewDetailItem";
import BankBook from "@/components/Banking/BankBook";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import useAuth from "@/components/Hooks/useAuth";

export interface IBookData {
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

const Index = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const setMyBookData = useSetRecoilState(selectMyBookState);
  const currentUser = useAuth();
  const userInfo = useUser(currentUser?.uid);
  const totalBook = userInfo?.length || 0;
  const totalAmount =
    userInfo
      ?.reduce((cur: number, acc: IBookData) => {
        return cur + acc.price;
      }, 0)
      .toLocaleString("ko-KR") || 0;

  useEffect(() => {
    queryClient.resetQueries();
    queryClient.invalidateQueries("getMyBookList");
    setMyBookData({});
    if (isEdit) {
      setIsEdit(!isEdit);
    }
  }, []);

  const onShare = async () => {
    await window.Kakao.Share.sendCustom({
      templateId: 94039,
      templateArgs: {
        totalBook,
        totalAmount,
        userProfile: currentUser?.photoURL,
        userName: currentUser?.displayName,
      },
    });
  };

  return (
    <Section>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="독서 기록 남기기" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="독서, 독후감, 독서 기록, 독서기록장" />
        <title>Book Bank / 내역</title>
      </Helmet>
      <DataItemContainer>
        <BankBook
          onClick={() => onShare()}
          text="공유하기"
          secondOnClick={() => router.push("/banking/deposit")}
          secondText="입금하기"
          transform="10%"
        />
        <ReviewItem />
      </DataItemContainer>
      <ReviewDetailItem />
    </Section>
  );
};

const Section = styled.section`
  height: 100%;
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 20px;
  position: relative;
`;

// 리뷰 인피티니 스크롤
const DataItemContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export default Index;
