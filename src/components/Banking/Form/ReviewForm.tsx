import React, { useRef, useState } from "react";
import Image from "next/image";
import { v4 as uuid_v4 } from "uuid";
import styled from "@emotion/styled";
import { useRecoilValue, useResetRecoilState } from "recoil";
import UserDirectForm from "./UserDirectForm";
import useAuth from "../../Hooks/useAuth";
import useModal from "../../Hooks/useModal";
import { useAddBook } from "../../Hooks/useBanking";
import CustomButton from "../../Custom/CustomButton";
import { NO_IMAGE } from "@/share/server";
import { selectBookState, userDirectFormState } from "@/share/atom";
import dynamic from "next/dynamic";

const ErrorModal = dynamic(() => import("../../Custom/ErrorModal"), {
  ssr: false,
});

const ReviewForm = () => {
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
  const targetBookData = useRecoilValue(selectBookState);
  const ReviewAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: addNewBookReview } = useAddBook();
  const userDirectFormData = useRecoilValue(userDirectFormState);
  const resetList = useResetRecoilState(selectBookState);
  const [disabled, toggleDisabled] = useState<boolean>(false);

  const ReviewArea = () => {
    return (
      <TextArea
        ref={ReviewAreaRef}
        placeholder="후기를 적어주세요. (선택)"
        id="review"
      />
    );
  };

  const onSubmitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toggleDisabled((prev) => !prev);

    const newBookReview = {
      title: targetBookData.title || "",
      publisher: targetBookData.publisher || "",
      price: targetBookData?.price || 0,
      id: uuid_v4(),
      authors:
        targetBookData?.authors?.length !== 0
          ? targetBookData?.authors
          : ["정보 없음"],
      thumbnail: targetBookData?.thumbnail || NO_IMAGE,
      review: ReviewAreaRef.current?.value || "",
      uid: currentUser.uid,
      createdAt: Date.now(),
      createdYear: new Date().getFullYear(),
      createdMonth: new Date().getMonth() + 1,
      createdDay: new Date().getDate(),
    };

    try {
      await addNewBookReview(newBookReview);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isShowing && (
        <ErrorModal
          title="다시 시도해 주세요."
          content="리뷰 작성 중 오류가 발생했습니다."
          toggle={toggle}
        />
      )}
      <Container>
        <ReviewFormContainer>
          {userDirectFormData && <UserDirectForm />}
          {Object.keys(targetBookData).length > 0 && (
            <form onSubmit={(event) => onSubmitReview(event)}>
              <BookTitle>{targetBookData?.title}</BookTitle>
              <BookDescriptionConatiner>
                <Image
                  src={targetBookData.thumbnail || NO_IMAGE}
                  height={174}
                  width={120}
                  alt={`${targetBookData.title}의 책표지입니다. `}
                  loading="eager"
                />
                <BookDesc>
                  <div>
                    {targetBookData.authors?.length === 0
                      ? "정보 없음"
                      : typeof targetBookData.authors === "object" &&
                        targetBookData.authors?.slice(0, 3).join(", ")}
                    {targetBookData.authors?.length! > 3 && " 외"}
                  </div>
                  <div>{targetBookData?.publisher || "정보 없음"}</div>
                  <div>{targetBookData.price?.toLocaleString()}</div>
                </BookDesc>
              </BookDescriptionConatiner>
              <TextAreaLabel htmlFor="review">후기</TextAreaLabel>
              <ReviewArea />
              <ButtonContainer>
                <CustomButton
                  type="submit"
                  value="기록하기"
                  disabled={disabled}
                />
                <CustomButton
                  type="button"
                  value="닫기"
                  onClick={resetList}
                  disabled={disabled}
                />
              </ButtonContainer>
            </form>
          )}
        </ReviewFormContainer>
      </Container>
    </>
  );
};

export default ReviewForm;

const Container = styled.article`
  width: 100%;
  height: 100%;
  @media (max-width: 600px) {
    position: absolute;
  }
`;

export const BookTitle = styled.div`
  font-weight: 800;
  font-size: 1.2rem;
  margin-bottom: 24px;
  @media (max-width: 1200px) {
    font-size: 1rem;
  }
`;

const ReviewFormContainer = styled.div`
  width: 100%;
  background-color: var(--bg-color);
  height: 100%;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
`;

const TextArea = styled.textarea`
  border: none;
  resize: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 100;
  box-sizing: border-box;
  width: 100%;
  height: 200px;
  padding: 12px;
  margin: 20px 0;
  @media (max-width: 280px) {
    height: 140px;
    margin: 12px 0;
  }
`;

const TextAreaLabel = styled.label`
  font-weight: 800;
  font-size: 1.2rem;
`;

const BookDescriptionConatiner = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 20px;
  @media (max-width: 1200px) {
    > img {
      height: 120px;
      width: auto;
    }
  }
  @media (max-width: 375px) {
    flex-direction: column;
    img {
      height: 160px;
      width: 110px;
    }
  }
`;

export const BookDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: normal;
  font-weight: 100;
  font-size: 1rem;
  > div:nth-of-type(1)::before {
    content: "작가: ";
  }
  > div:nth-of-type(2)::before {
    content: "출판사: ";
  }
  > div:nth-of-type(3)::before {
    content: "가격: ";
  }
  @media (max-width: 1200px) {
    > div {
      font-size: 0.9rem;
    }
  }
  @media (max-width: 280px) {
    gap: 4px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  > button:first-of-type {
    color: var(--point-color1);
    border: 1px solid var(--point-color1);
  }
  > button:last-of-type {
    color: var(--point-color2);
    border: 1px solid var(--point-color2);
  }
`;
