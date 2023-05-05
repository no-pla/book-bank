import React from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { useUpdateBook } from "../Hooks/useBanking";
import { isFormEdit, selectMyBookState } from "@/share/atom";

const EditForm = () => {
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const { mutate: updateReview } = useUpdateBook();
  const setIsEdit = useSetRecoilState(isFormEdit);
  const isEdit = useRecoilValue(isFormEdit);
  const resetEdit = useResetRecoilState(isFormEdit);
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

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const onEdit = async (data: any) => {
    const editReview = {
      ...targetMyBookData,
      ...data,
      price: +data?.price,
    };
    await updateReview(editReview);
    resetEdit();
    setDetail(editReview);
  };

  return (
    <>
      <form onSubmit={handleSubmit((data) => onEdit(data))}>
        <input
          {...register("title", {
            required: {
              value: true,
              message: "필수 입력값입니다.",
            },
          })}
          placeholder="제목 (필수)"
        />
        <p>
          {errors.title?.type === "required" &&
            errors.title.message?.toString()}
        </p>
        <input
          {...register("authors", {
            required: {
              value: true,
              message: "필수 입력값입니다.",
            },
          })}
          placeholder="작가 (필수)"
        />
        <p>
          {errors.authors?.type === "required" &&
            errors.authors.message?.toString()}
        </p>
        <input
          {...register("price", {
            required: {
              value: true,
              message: "필수 입력값입니다.",
            },
          })}
          placeholder="금액 (필수)"
        />
        <p>
          {errors.price?.type === "required" &&
            errors.price.message?.toString()}
        </p>
        <input
          {...register("publisher", {
            required: {
              value: true,
              message: "필수 입력값입니다.",
            },
          })}
          placeholder="출판사 (필수)"
        />
        <p>
          {errors.publisher?.type === "required" &&
            errors.publisher.message?.toString()}
        </p>
        <textarea {...register("review")} placeholder="리뷰 (선택)" />
        <button type="submit">수정</button>
        <button onClick={() => toggleEdit()}>수정 취소</button>
      </form>
    </>
  );
};

export default EditForm;
