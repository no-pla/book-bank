import React, { useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { useRecoilValue, useSetRecoilState } from "recoil";
import EditForm from "./EditForm";
import useModal from "../Hooks/useModal";
import ConfirmModal from "../Custom/ConfirmModal";
import { useDeleteBook } from "../Hooks/useBanking";
import { isFormEdit, selectMyBookState } from "@/share/atom";

const ReviewDetailItem = () => {
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const setMyBookData = useSetRecoilState(selectMyBookState);
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const { mutate: deleteReview } = useDeleteBook();
  const { isShowing, toggle } = useModal();
  const [errorMessage, setErrorMessage] = useState<string[]>(["", ""]);

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const onDelete = async () => {
    try {
      await deleteReview(targetMyBookData?.id);
    } catch (error) {
      setErrorMessage(["에러가 발생했습니다.", "다시 삭제를 시도해 주세요."]);
    }
    setMyBookData({});
    toggle();
  };

  const toggleDelete = () => {
    setErrorMessage(["정말로 삭제할까요?", "이 작업은 되돌릴 수 없습니다."]);
    toggle();
  };

  return (
    <BankBookDetailDataContainer>
      {isShowing && (
        <ConfirmModal
          title={errorMessage[0]}
          content={errorMessage[1]}
          toggle={toggle}
          onFunc={onDelete}
        />
      )}
      <BankBookDetailData>
        {isEdit ? (
          <EditForm />
        ) : (
          <>
            {Object.keys(targetMyBookData).length > 0 && (
              <div>
                <BookTitle>{targetMyBookData.title}</BookTitle>
                <BookSetting>
                  <BookDate>
                    {new Date(targetMyBookData?.createdAt).toLocaleString()}
                  </BookDate>
                  <div>
                    <button onClick={toggleEdit}>수정</button>
                    <button onClick={toggleDelete}>삭제</button>
                  </div>
                </BookSetting>
                <BookInfoContainer>
                  <Image
                    src={targetMyBookData.thumbnail}
                    height={150}
                    width={110}
                    alt={`${targetMyBookData.title}의 책표지입니다. `}
                  />
                  <BookInfo>
                    <div>
                      {targetMyBookData.authors.join(", ") || "정보 없음"}
                    </div>
                    <div>{targetMyBookData.publisher || "정보 없음"}</div>
                    <div>
                      {targetMyBookData.price.toLocaleString() || "정보 없음"}
                    </div>
                  </BookInfo>
                </BookInfoContainer>
                <ReviewTitle>후기</ReviewTitle>
                <Review>
                  {targetMyBookData.review || "작성한 리뷰가 없습니다."}
                </Review>
              </div>
            )}
          </>
        )}
      </BankBookDetailData>
    </BankBookDetailDataContainer>
  );
};

export default ReviewDetailItem;

// 수정 폼
// const EditForm = styled.form`
//   background-color: rebeccapurple;
// `;

// 리뷰 디테일

const BookSetting = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
`;

const BankBookDetailDataContainer = styled.section`
  height: 100%;
  background-color: #bfb0d1;
  border-radius: 12px;
  width: 50%;
  padding: 20px;
  box-sizing: border-box;
`;

const BankBookDetailData = styled.div`
  background-color: whitesmoke;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 12px;
  > div {
    height: 100%;
  }
`;

const BookInfoContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const ReviewTitle = styled.div`
  margin: 20px 0;
  font-weight: 800;
  font-size: 1.2rem;
`;

const Review = styled.div`
  font-size: 0.9rem;
  height: 240px;
  overflow-y: scroll;
  white-space: break-spaces;
  border: 1px solid lightgray;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 8px;
  line-height: 1.1rem;
`;

const BookTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 12px;
`;

const BookDate = styled.div`
  color: darkgray;
  font-size: 0.9rem;
`;

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  > div:nth-of-type(1)::before {
    content: "작가: ";
  }
  > div:nth-of-type(2)::before {
    content: "출판사: ";
  }
  > div:nth-of-type(3)::before {
    content: "가격: ";
  }
`;

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

// const Review = styled.div`
//   border-top: 1px solid darkgrey;
//   padding-top: 12px;
//   line-height: 20px;
//   font-size: 0.9rem;
//   word-break: break-all;
//   white-space: pre-wrap;
// `;
