import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import useUser from "@/components/Hooks/useUser";
import ReviewItem from "@/components/Banking/ReviewItem";
import ReviewDetailItem from "@/components/Banking/ReviewDetailItem";
import { isFormEdit, selectMyBookState } from "@/share/atom";

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

const Index = ({ currentUser }: any) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const setMyBookData = useSetRecoilState(selectMyBookState);
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
        <BankBookData>
          <BankBookInfo>
            {totalAmount}원&nbsp;({totalBook}권)
          </BankBookInfo>
          <BankBookInfoButtonContainer>
            <button onClick={onShare}>공유</button>
            <button onClick={() => router.push("/banking/deposit")}>
              입금하기
            </button>
          </BankBookInfoButtonContainer>
        </BankBookData>
        <ReviewItem />
      </DataItemContainer>
      <ReviewDetailItem />
    </Section>
  );
};

// 통장 정보란
const BankBookData = styled.div`
  background-color: #bfb0d1;
  border-radius: 12px;
  height: 160px;
  padding: 20px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
`;

const BankBookInfo = styled.div`
  font-weight: 800;
  font-size: 1.8rem;
  transform: translateY(-80%);
`;

const BankBookInfoButtonContainer = styled.div`
  width: 100%;
  > button {
    width: 50%;
    padding: 2px 4px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-weight: 300;
    font-size: 1rem;
  }
  > button:first-of-type {
    border-right: 1px solid lightgray;
  }
`;

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
