import React from "react";
import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import { useUpdateBook } from "../Hooks/useBanking";
import CustomButton from "../Custom/CustomButton";
import ConfirmModal from "../Custom/ConfirmModal";
import { Input } from "../Custom/AuthInput";
import useModal from "../Hooks/useModal";

interface IEditData {
  authors: string | string[];
  price: number;
  publisher: string;
  review: string;
  title: string;
}

const EditForm = () => {
  const { isShowing, toggle } = useModal();
  const { mutate: updateReview } = useUpdateBook();
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const setDetail = useSetRecoilState<any>(selectMyBookState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: targetMyBookData?.title,
      price: targetMyBookData?.price,
      review: targetMyBookData.review,
      authors: targetMyBookData?.authors,
      publisher: targetMyBookData?.publisher,
    },
  });

  const onEdit = async (data: any) => {
    let authors = data.authors;
    if (typeof data.authors === "string") {
      authors = authors.split(",").map((author: string) => author.trim());
    }

    const editReview = {
      ...targetMyBookData,
      authors,
      price: +data.price,
      publisher: data.publisher,
      review: data?.review,
      title: data.title,
    };
    await updateReview(editReview);
    setDetail(editReview);
    setIsEdit(!isEdit);
  };

  return (
    <>
      {isShowing === true && (
        <ConfirmModal
          title="정말로 수정을 취소할까요?"
          content="이 작업은 되돌릴 수 없습니다!"
          toggle={toggle}
          onFunc={() => setIsEdit(!isEdit)}
        />
      )}
      <Form onSubmit={handleSubmit((data) => onEdit(data))}>
        <Label htmlFor="title">책 제목</Label>
        <Input
          {...register("title", {
            required: {
              value: true,
              message: "필수 입력값입니다.",
            },
          })}
          placeholder="제목 (필수)"
          id="title"
        />
        <p>
          {errors.title?.type === "required" &&
            errors.title.message?.toString()}
        </p>
        <Label htmlFor="authors">작가</Label>
        <Input
          {...register("authors", {
            required: {
              value: true,
              message: "필수 입력값입니다.",
            },
          })}
          placeholder="작가 (필수)"
          id="authors"
        />
        <p>
          {errors.authors?.type === "required" &&
            errors.authors.message?.toString()}
        </p>
        <Label htmlFor="publisher">출판사</Label>
        <Input
          {...register("publisher", {
            required: {
              value: true,
              message: "필수 입력값입니다.",
            },
          })}
          placeholder="출판사 (필수)"
          id="publisher"
        />
        <p>
          {errors.publisher?.type === "required" &&
            errors.publisher.message?.toString()}
        </p>
        <Label htmlFor="price">가격</Label>
        <Input
          {...register("price", {
            pattern: {
              value: /^\d+$/,
              message: "금액은 쉼표 없이 숫자만 입력해 주세요",
            },
            required: {
              value: true,
              message: "필수 입력값입니다.",
            },
          })}
          placeholder="금액 (필수)"
          id="price"
        />
        <p>
          {(errors.price?.type === "required" &&
            errors.price.message?.toString()) ||
            (errors.price?.type === "pattern" &&
              errors.price.message?.toString())}
        </p>
        <Label htmlFor="review">리뷰</Label>
        <TextArea
          {...register("review")}
          placeholder="리뷰 (선택) 최대 500글자"
          id="review"
        />
        <p>
          {errors.review?.type === "maxLength" &&
            errors.review.message?.toString()}
        </p>
        <CustomButton value="수정" type="submit" />
        <CustomButton value="수정 취소" type="button" onClick={toggle} />
      </Form>
    </>
  );
};

export default EditForm;

const Form = styled.form`
  background-color: whitesmoke;
  margin: 12px;
  border-radius: 4px;
  padding: 12px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  > button:first-of-type {
    color: var(--point-color1);
    border: 1px solid var(--point-color1);
    margin-bottom: 4px;
  }
  > button:last-of-type {
    color: var(--point-color2);
    border: 1px solid var(--point-color2);
  }
`;

export const TextArea = styled.textarea`
  border: none;
  resize: none;
  border-radius: 4px;
  height: 100%;
  padding: 12px;
`;

const Label = styled.label`
  margin: 8px 0;
`;
