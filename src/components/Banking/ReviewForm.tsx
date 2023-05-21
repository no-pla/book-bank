import React, { useRef } from "react";
import { v4 as uuid_v4 } from "uuid";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import useAuth from "../Hooks/useAuth";
import { selectBookState, userDirectFormState } from "@/share/atom";
import { useAddBook } from "../Hooks/useBanking";
import useModal from "../Hooks/useModal";
import Image from "next/image";
import { NO_IMAGE } from "@/share/server";
import UserDirectForm from "./UserDirectForm";

const ReviewForm = () => {
  const currentUser = useAuth();
  const router = useRouter();
  const targetBookData = useRecoilValue<any>(selectBookState);
  const ReviewAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: addNewBookReview } = useAddBook();
  const userDirectFormData = useRecoilValue(userDirectFormState);

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

  return (
    <div>
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
                    : targetBookData.authors.join(", ")}
                </div>
                <div>{targetBookData.publisher}</div>
                <div>{targetBookData.price.toLocaleString()}</div>
              </BookDesc>
            </BookDescriptionConatiner>
            <TextAreaLabel htmlFor="review">후기</TextAreaLabel>
            <ReviewArea />
            <SubmitButton>기록 남기기</SubmitButton>
          </form>
        )}
      </ReviewFormContainer>
    </div>
  );
};

export default ReviewForm;

export const BookTitle = styled.div`
  font-weight: 800;
  font-size: 1.2rem;
  margin-bottom: 24px;
`;

const ReviewFormContainer = styled.div`
  width: 100%;
  background-color: whitesmoke;
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
`;

export const BookDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: normal;
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

const SubmitButton = styled.button`
  background-color: var(--sub-main-color);
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--main-color);
  border-radius: 8px;
  cursor: pointer;
`;
