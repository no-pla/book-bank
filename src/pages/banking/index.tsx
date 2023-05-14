import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useUser from "@/components/Hooks/useUser";
import EditForm from "@/components/Banking/EditForm";
import ReviewItem from "@/components/Banking/ReviewItem";
import CustomButton from "@/components/Custom/CustomButton";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import ReviewDetailItem from "@/components/Banking/ReviewDetailItem";

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
      <UserInfoBox>
        <CustomButton value="뒤로" onClick={() => router.push("/")} />
        {userInfo
          ?.reduce((cur: number, acc: IBookData) => {
            return cur + acc.price;
          }, 0)
          .toLocaleString("ko-KR") || 0}
        원&nbsp;(총 {userInfo?.length}권)
        <ButtonContainer>
          <CustomButton
            value="입금하러 가기"
            onClick={() => router.push("/banking/deposit")}
          />
          <CustomButton value="공유하기" />
        </ButtonContainer>
      </UserInfoBox>
      <Conatiner>
        {/* 전체 리스트 */}
        <ReviewItem currentUser={currentUser} />
        {/* 상세 정보 */}
        {!isEdit ? (
          <ReviewDetailItem />
        ) : (
          // 수정용 폼
          <EditForm />
        )}
      </Conatiner>
    </Section>
  );
};

const Section = styled.section`
  height: 100vh;
  width: 100vw;
`;

const UserInfoBox = styled.section`
  height: 160px;
  background-color: var(--point-color1);
  display: flex;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  width: 100%;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  > button {
    display: none;
  }
  @media (max-width: 600px) {
    width: 100vw;
    height: calc(160px - 5vh);
    margin-top: 5vh;
  }
  > button {
    align-self: flex-start;
    margin-left: 20px;
    border: 1px solid var(--main-color);
  }
`;

const Conatiner = styled.section`
  height: calc(100vh - 160px);
  overflow-y: scroll;
  display: flex;
  > * {
    width: 50%;
  }
`;

const ButtonContainer = styled.div`
  > button {
    color: var(--text-color);
    border: 1px solid var(--main-color);
  }
  > button:first-of-type {
    margin-right: 8px;
  }
`;

export default Index;
