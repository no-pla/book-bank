import React from "react";
import styled from "@emotion/styled";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useModal from "../Hooks/useModal";
import ErrorModal from "../Custom/ErrorModal";
import { useDeleteBook } from "../Hooks/useBanking";
import { isFormEdit, selectMyBookState } from "@/share/atom";

const ReviewDetailItem = () => {
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const setMyBookData = useSetRecoilState(selectMyBookState);
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const { mutate: deleteReview } = useDeleteBook();
  const { isShowing, toggle } = useModal();

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const onDelete = async () => {
    await deleteReview(targetMyBookData?.id);
    setMyBookData({});
    toggle();
  };

  return (
    <>
      {isShowing && (
        <ErrorModal
          title="정말로 삭제할까요?"
          content="이 작업은 되돌릴 수 없습니다!"
          toggle={toggle}
          onFunc={onDelete}
        />
      )}
      {Object.keys(targetMyBookData).length > 0 && (
        <BookDetailContainer>
          <BookDetailTitle>{targetMyBookData.title}</BookDetailTitle>
          <BookDetailCreatedAt>
            {new Date(targetMyBookData?.createdAt).toLocaleString("ko-KR")}
          </BookDetailCreatedAt>
          <BookDetailInfo>
            <span>{targetMyBookData.authors.join(", ") || "정보 없음"}</span>
            <span>{targetMyBookData.publisher || "정보 없음"}</span>
          </BookDetailInfo>
          <BookDetailButtonContainer>
            <button onClick={toggle}>삭제</button>
            <button onClick={toggleEdit}>수정</button>
          </BookDetailButtonContainer>
          <Review>
            {targetMyBookData.review || "작성한 리뷰가 없습니다."}
          </Review>
        </BookDetailContainer>
      )}
    </>
  );
};

export default ReviewDetailItem;

const BookDetailContainer = styled.div`
  padding: 12px;
  margin: 12px;
  border-radius: 8px;
  text-align: center;
  overflow-y: scroll;
  background-color: whitesmoke;
`;

const BookDetailTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  margin-top: 12px;
  margin-bottom: 20px;
`;

const BookDetailCreatedAt = styled.div`
  color: darkgrey;
`;

const BookDetailInfo = styled.div`
  margin: 12px 0;
  > span:first-of-type::before {
    content: "작가: ";
  }
  > span:first-of-type::after {
    content: " | ";
  }
  > span:nth-of-type(2)::before {
    content: "출판사: ";
  }
`;

const BookDetailButtonContainer = styled.div`
  text-align: right;
  > button {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  > button:first-of-type {
    color: var(--point-color2);
  }
  > button:last-of-type {
    color: var(--point-color1);
  }
  margin-bottom: 12px;
`;

const Review = styled.div`
  border-top: 1px solid darkgrey;
  padding-top: 12px;
  line-height: 20px;
  font-size: 0.9rem;
  word-break: break-all;
  white-space: pre-wrap;
`;
