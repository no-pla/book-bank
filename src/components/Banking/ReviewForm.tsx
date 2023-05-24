import React, { useRef } from "react";
import { v4 as uuid_v4 } from "uuid";
import styled from "@emotion/styled";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { useRouter } from "next/router";
import useAuth from "../Hooks/useAuth";
import { selectBookState, userDirectFormState } from "@/share/atom";
import { useAddBook } from "../Hooks/useBanking";
import Image from "next/image";
import { NO_IMAGE } from "@/share/server";
import UserDirectForm from "./UserDirectForm";
import CustomButton from "../Custom/CustomButton";

const ReviewForm = () => {
  const currentUser = useAuth();
  const router = useRouter();
  const targetBookData = useRecoilValue<any>(selectBookState);
  const ReviewAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: addNewBookReview } = useAddBook();
  const userDirectFormData = useRecoilValue(userDirectFormState);
  const resetList = useResetRecoilState(selectBookState);

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
    const newBookReview = {
      title: targetBookData.title,
      publisher: targetBookData.publisher,
      price: targetBookData?.price || 0,
      id: uuid_v4(),
      authors:
        targetBookData?.authors.length !== 0
          ? targetBookData?.authors
          : ["정보 없음"],
      thumbnail: targetBookData?.thumbnail || NO_IMAGE,
      review: ReviewAreaRef.current?.value,
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
    router.push("/banking");
  };

  const onClose = () => {
    resetList();
  };

  return (
    <Container>
      <ReviewFormContainer>
        {userDirectFormData && <UserDirectForm />}
        {Object.keys(targetBookData).length > 0 && (
          <form onSubmit={(event) => onSubmitReview(event)}>
            <BookTitle>{targetBookData?.title}</BookTitle>
            <BookDescriptionConatiner>
              <Image
                src={targetBookData.thumbnail || NO_IMAGE}
                height={150}
                width={100}
                alt={`${targetBookData.title}의 책표지입니다. `}
              />
              <BookDesc>
                <div>
                  {targetBookData.authors.length === 0
                    ? "정보 없음"
                    : targetBookData.authors.slice(0, 3).join(", ")}
                  {targetBookData.authors.length > 3 && " 외"}
                </div>
                <div>{targetBookData.publisher}</div>
                <div>{targetBookData.price.toLocaleString()}</div>
              </BookDesc>
            </BookDescriptionConatiner>
            <TextAreaLabel htmlFor="review">후기</TextAreaLabel>
            <ReviewArea />
            <ButtonContainer>
              <CustomButton type="submit" value="기록하기" />
              <CustomButton type="button" value="닫기" onClick={onClose} />
            </ButtonContainer>
          </form>
        )}
      </ReviewFormContainer>
    </Container>
  );
};

export default ReviewForm;

const Container = styled.div`
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
`;

const ReviewFormContainer = styled.div`
  width: 100%;
  background-color: var(--bg-color);
  height: 100%;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  border: none;
  resize: none;
  border-radius: 4px;
  box-sizing: border-box;
  width: 100%;
  height: 260px;
  padding: 12px;
  margin: 20px 0;
  @media (max-width: 280px) {
    height: 140px;
    margin: 0;
    margin-top: 8px;
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
  @media (max-width: 375px) {
    > img {
      width: 70px;
      height: 100px;
    }
  }
  @media (max-width: 280px) {
    > img {
      display: none;
      margin: 0;
    }
  }
`;

export const BookDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: normal;
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
