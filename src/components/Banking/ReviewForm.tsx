import React, { useRef } from "react";
import { v4 as uuid_v4 } from "uuid";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import useAuth from "../Hooks/useAuth";
import { selectBookState } from "@/share/atom";
import { useAddBook } from "../Hooks/useBanking";

const ReviewForm = () => {
  const currentUser = useAuth();
  const router = useRouter();
  const targetBookData = useRecoilValue<any>(selectBookState);
  const ReviewAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: addNewBookReview } = useAddBook();

  const ReviewArea = () => {
    return (
      <TextArea ref={ReviewAreaRef} placeholder="후기를 적어주세요. (선택)" />
    );
  };

  const onSubmitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newBookReview = {
      title: targetBookData.title,
      publisher: targetBookData.publisher,
      price: targetBookData?.price || "금액 정보 없음",
      id: uuid_v4(),
      authors: targetBookData?.authors || ["작가 정보 없음"],
      thumbnail: targetBookData?.thumbnail || "",
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
    <ReviewFormContainer>
      {Object.keys(targetBookData).length > 0 && (
        <div>
          <BookInfo>
            {targetBookData?.title} - {targetBookData.authors}
          </BookInfo>
          <FormContainer>
            <ReviewWriteForm onSubmit={(event) => onSubmitReview(event)}>
              <ReviewArea />
              <DepositButton>책 저금하기</DepositButton>
            </ReviewWriteForm>
          </FormContainer>
        </div>
      )}
    </ReviewFormContainer>
  );
};

export default ReviewForm;

const BookInfo = styled.div`
  padding: 16px;
  font-weight: 700;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReviewFormContainer = styled.div`
  background-color: var(--bg-color);
  height: calc(100vh - 24px);
  > div {
    margin: 12px 12px 0 12px;
    border-radius: 12px;
    background-color: whitesmoke;
    height: 100%;
    text-align: center;
  }
`;

const ReviewWriteForm = styled.form`
  border-radius: 4px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TextArea = styled.textarea`
  border: none;
  resize: none;
  border-radius: 4px;
  height: 100%;
  padding: 12px;
`;

const FormContainer = styled.div`
  height: calc(100% - 72px);
`;

const DepositButton = styled.button`
  padding: 12px 0;
  border: none;
  background-color: var(--point-color1);
  cursor: pointer;
`;
