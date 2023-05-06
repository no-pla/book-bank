import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isFormEdit, selectMyBookState } from "@/share/atom";

const ReviewDetailItem = ({ toggle }: any) => {
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const isEdit = useRecoilValue(isFormEdit);

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <>
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
