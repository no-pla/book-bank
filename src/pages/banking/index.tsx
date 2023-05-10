import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "@emotion/styled";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import useUser from "@/components/Hooks/useUser";
import EditForm from "@/components/Banking/EditForm";
import ReviewItem from "@/components/Banking/ReviewItem";
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
  const queryClient = useQueryClient();
  const setMyBookData = useSetRecoilState(selectMyBookState);
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const userInfo = useUser(currentUser?.uid);

  useEffect(() => {
    queryClient.resetQueries();
    setMyBookData({});
    if (isEdit) {
      setIsEdit(!isEdit);
    }
  }, []);

  return (
    <Section>
      <UserInfoBox>
        {userInfo
          ?.reduce((cur: number, acc: IBookData) => {
            console.log(acc);
            return cur + acc.price;
          }, 0)
          .toLocaleString("ko-KR") || 0}
        원&nbsp;(총 {userInfo?.length}권)
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
  align-items: center;
  font-size: 1.3rem;
  font-weight: 800;
  width: 100%;
  @media (max-width: 600px) {
    width: 100vw;
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

export default Index;
