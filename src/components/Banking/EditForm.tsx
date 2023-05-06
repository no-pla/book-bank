import React from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useUpdateBook } from "../Hooks/useBanking";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import ErrorModal from "../Custom/ErrorModal";
import useModal from "../Hooks/useModal";

const EditForm = () => {
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const { mutate: updateReview } = useUpdateBook();
  const setDetail = useSetRecoilState<any>(selectMyBookState);
  const { isShowing, toggle } = useModal();
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);

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
    const editReview = {
      ...targetMyBookData,
      authors: data.authors.split(",").map((author: string) => author.trim()),
      price: +data.price,
      publisher: data.publisher,
      review: data?.review,
      title: data.title,
    };
    console.log(editReview);

    await updateReview(editReview);
    setDetail(editReview);
    setIsEdit(!isEdit);
  };

  return (
    <>
      {isShowing === true && (
        <ErrorModal
          title="정말로 수정을 취소할까요?"
          content="이 작업은 되돌릴 수 없습니다!"
          toggle={toggle}
          onFunc={() => setIsEdit(!isEdit)}
        />
      )}
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
        <button type="button" onClick={toggle}>
          수정 취소
        </button>
      </form>
    </>
  );
};

export default EditForm;
