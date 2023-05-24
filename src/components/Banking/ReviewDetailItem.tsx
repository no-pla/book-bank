import React, { useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import EditForm from "./EditForm";
import useModal from "../Hooks/useModal";
import { useDeleteBook } from "../Hooks/useBanking";
import ConfirmModal from "../Custom/ConfirmModal";
import CustomButton from "../Custom/CustomButton";
import { isFormEdit, selectMyBookState } from "@/share/atom";

const ReviewDetailItem = () => {
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const reset = useResetRecoilState(selectMyBookState);
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
    <BankBookDetailDataContainer
      show={Object.keys(targetMyBookData).length > 0 ? "block" : "none"}
    >
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
                  <SettingButton>
                    <button onClick={toggleEdit}>수정</button>
                    <button onClick={toggleDelete}>삭제</button>
                  </SettingButton>
                </BookSetting>
                <BookInfoContainer>
                  <Image
                    src={targetMyBookData.thumbnail}
                    height={150}
                    width={110}
                    alt={`${targetMyBookData.title}의 책표지입니다. `}
                    style={{ objectFit: "cover" }}
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
                <ButtonContainer>
                  <CustomButton value="닫기" onClick={reset} />
                </ButtonContainer>
              </div>
            )}
          </>
        )}
      </BankBookDetailData>
    </BankBookDetailDataContainer>
  );
};

export default ReviewDetailItem;

const SettingButton = styled.div`
  > button:first-of-type {
    font-size: 1.1rem;
    color: var(--point-color1);
  }
  > button:last-of-type {
    font-size: 1.1rem;
    color: var(--point-color2);
  }
`;

const ButtonContainer = styled.div`
  margin: 12px;
  text-align: center;
  > button {
    font-size: 1.2rem;
    font-weight: 100;
    color: var(--point-color1);
    border: 1px solid var(--point-color1);
  }
`;

const BookSetting = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-weight: 100;
    font-size: 1rem;
  }
  @media (max-width: 320px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BankBookDetailDataContainer = styled.section<{ show: string }>`
  height: 100%;
  background-color: #bfb0d1;
  border-radius: 12px;
  width: 50%;
  padding: 20px;
  box-sizing: border-box;
  @media (max-width: 600px) {
    position: absolute;
    width: 100%;
    display: ${(props) => props.show};
  }
  @media (max-width: 280px) {
    overflow: scroll;
  }
`;

const BankBookDetailData = styled.div`
  background-color: whitesmoke;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 12px;
  overflow-y: scroll;
  > div {
    height: 100%;
  }
`;

const BookInfoContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  @media (max-width: 280px) {
    flex-direction: column;
    img {
      display: none;
    }
  }
`;

const ReviewTitle = styled.div`
  margin: 20px 0;
  font-weight: 800;
  font-size: 1.4rem;
`;

const Review = styled.div`
  font-size: 1.1rem;
  font-weight: 100;
  overflow-y: scroll;
  white-space: break-spaces;
  border: 1px solid lightgray;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 8px;
  line-height: 1.1rem;
  height: 24%;
`;

const BookTitle = styled.div`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 12px;
`;

const BookDate = styled.div`
  color: darkgray;
  font-size: 1.1rem;
  font-weight: 100;
`;

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 100;
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
