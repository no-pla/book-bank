import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useQueryClient } from "react-query";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import EditForm from "@/components/Banking/EditForm";
import ReviewDetailItem from "@/components/Banking/ReviewDetailItem";
import ReviewItem from "@/components/Banking/ReviewItem";

const Index = ({ currentUser }: any) => {
  const queryClient = useQueryClient();
  const setMyBookData = useSetRecoilState(selectMyBookState);
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);

  useEffect(() => {
    queryClient.resetQueries();
    setMyBookData({});
    if (isEdit) {
      setIsEdit(!isEdit);
    }
  }, []);

  return (
    <>
      <Container>
        {/* 전체 리스트 */}
        <ReviewItem currentUser={currentUser} />
        {!isEdit ? (
          <>
            {/* 상세 정보 */}
            <ReviewDetailItem />
          </>
        ) : (
          // 수정용 폼
          <EditForm />
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  > div:first-of-type {
    background-color: #33ff33;
    flex-grow: 1;
  }

  > div:nth-of-type(2) {
    background-color: magenta;
    flex-grow: 1;
  }
`;

export default Index;
