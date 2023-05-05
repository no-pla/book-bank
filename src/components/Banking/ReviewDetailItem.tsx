import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useDeleteBook } from "../Hooks/useBanking";
import { isFormEdit, selectMyBookState } from "@/share/atom";

const ReviewDetailItem = () => {
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const { mutate: deleteReview } = useDeleteBook();
  const setIsEdit = useSetRecoilState(isFormEdit);
  const isEdit = useRecoilValue(isFormEdit);

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const onDelete = async (targetId: string) => {
    await deleteReview(targetId);
  };

  return (
    <div>
      {Object.keys(targetMyBookData).length > 0 && (
        <div>
          <div>{targetMyBookData.title}</div>
          <div>{targetMyBookData.authors}</div>
          <div>{targetMyBookData.publisher}</div>
          <div>{targetMyBookData.price.toLocaleString("ko-KR")}원</div>
          <div>{targetMyBookData.review}</div>
          <div>
            <button onClick={() => onDelete(targetMyBookData?.id)}>삭제</button>
            <button onClick={toggleEdit}>수정</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDetailItem;
