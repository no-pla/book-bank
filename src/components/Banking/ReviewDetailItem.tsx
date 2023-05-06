import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import ErrorModal from "../Custom/ErrorModal";
import useModal from "../Hooks/useModal";
import { useDeleteBook } from "../Hooks/useBanking";

const ReviewDetailItem = () => {
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const setMyBookData = useSetRecoilState(selectMyBookState);
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const { mutate: deleteReview } = useDeleteBook();
  const { isShowing, toggle } = useModal();

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const onDelete = async () => {
    await deleteReview(targetMyBookData?.id);
    setMyBookData({});
    toggle();
  };

  return (
    <>
      {isShowing && (
        <ErrorModal
          title="정말로 삭제할까요?"
          content="이 작업은 되돌릴 수 없습니다!"
          toggle={toggle}
          onFunc={onDelete}
        />
      )}
      {Object.keys(targetMyBookData).length > 0 && (
        <div>
          <div>{targetMyBookData.title}</div>
          <div>{targetMyBookData.authors}</div>
          <div>{targetMyBookData.publisher}</div>
          <div>{targetMyBookData.price.toLocaleString("ko-KR")}원</div>
          <div>{targetMyBookData.review}</div>
          <div>
            <button onClick={toggle}>삭제</button>
            <button onClick={toggleEdit}>수정</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewDetailItem;
