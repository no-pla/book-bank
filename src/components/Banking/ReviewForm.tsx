import React, { useRef } from "react";
import { v4 as uuid_v4 } from "uuid";
import { useRecoilValue } from "recoil";
import { selectBookState } from "@/share/atom";
import { useAddBook } from "../Hooks/useBanking";
import { useRouter } from "next/router";
import Image from "next/image";
import useAuth from "../Hooks/useAuth";

const ReviewForm = () => {
  const currentUser = useAuth();
  const router = useRouter();
  const targetBookData = useRecoilValue<any>(selectBookState);
  const ReviewAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: addNewBookReview } = useAddBook();

  const ReviewArea = () => {
    return (
      <textarea ref={ReviewAreaRef} placeholder="후기를 적어주세요. (선택)" />
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
    };
    try {
      await addNewBookReview(newBookReview);
    } catch (error) {
      console.log(error);
    }
    router.push("/banking");
  };

  return (
    <>
      {Object.keys(targetBookData).length > 0 && (
        <form onSubmit={(event) => onSubmitReview(event)}>
          <div>{targetBookData?.title}</div>
          <div>{targetBookData.authors}</div>
          <Image
            src={targetBookData.thumbnail}
            alt={`${targetBookData.title}의 책표지입니다.`}
            width={100}
            height={150}
          />
          <ReviewArea />
          <button>책 저금하기</button>
        </form>
      )}
    </>
  );
};

export default ReviewForm;
