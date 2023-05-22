import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useInfiniteQuery, useQueryClient } from "react-query";
import styled from "@emotion/styled";
import useUser from "@/components/Hooks/useUser";
import ReviewItem from "@/components/Banking/ReviewItem";
import ReviewDetailItem from "@/components/Banking/ReviewDetailItem";
import { DB_LINK } from "@/share/server";
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
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const setMyBookData = useSetRecoilState(selectMyBookState);
  const userInfo = useUser(currentUser?.uid);
  const MAX_BOOK = 10;

  const fetchMyBookReivewList = async (pageParam: number) => {
    return await axios.get(
      `${DB_LINK}/review?_sort=createdAt&_order=desc&_limit=${MAX_BOOK}&_page=${pageParam}&uid=${currentUser?.uid}`
    );
  };
  useEffect(() => {
    queryClient.resetQueries();
    queryClient.invalidateQueries("getMyBookList");
    setMyBookData({});
    if (isEdit) {
      setIsEdit(!isEdit);
    }
  }, []);

  return (
    <Section>
      <DataItemContainer>
        <BankBookData>
          <BankBookInfo>
            {userInfo
              ?.reduce((cur: number, acc: IBookData) => {
                return cur + acc.price;
              }, 0)
              .toLocaleString("ko-KR") || 0}
            원&nbsp;({userInfo?.length || 0}권)
          </BankBookInfo>
          <BankBookInfoButtonContainer>
            <button>공유</button>
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
  font-size: 1.4rem;
  transform: translateY(-150%);
`;

const BankBookInfoButtonContainer = styled.div`
  width: 100%;
  > button {
    width: 50%;
    padding: 2px 4px;
    border: none;
    background-color: transparent;
    cursor: pointer;
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
`;

// 리뷰 인피티니 스크롤
const DataItemContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default Index;
