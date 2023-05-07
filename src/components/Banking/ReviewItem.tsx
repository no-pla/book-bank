import React from "react";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useInfiniteQuery } from "react-query";
import useUser from "../Hooks/useUser";
import { DB_LINK } from "@/share/server";
import { isFormEdit, selectMyBookState } from "@/share/atom";

const ReviewItem = ({ currentUser }: any) => {
  const userInfo = useUser(currentUser?.uid);
  const MAX_BOOK = 2;
  const setMyBookData = useSetRecoilState(selectMyBookState);
  const isEdit = useRecoilValue(isFormEdit);
  const setIsEdit = useSetRecoilState(isFormEdit);
  const {
    data: myBookReviews,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    "getMyBookList",
    ({ pageParam = 1 }) => fetchMyBookReivewList(pageParam),
    {
      enabled: !!currentUser?.uid,
      notifyOnChangeProps: "tracked",
      getNextPageParam: (_lastPage, pages) => {
        if (pages.length < Math.ceil(userInfo?.length / MAX_BOOK)) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    }
  );

  const fetchMyBookReivewList = async (pageParam: number) => {
    return await axios.get(
      `${DB_LINK}/review?_sort=createdAt&_order=desc&_limit=${MAX_BOOK}&_page=${pageParam}&_uid=${currentUser?.uid}`
    );
  };

  const showDetailReview = (data: any) => {
    setMyBookData(data);
    if (isEdit === true) {
      // 수정 폼이 열린 상태로 상세보기를 누르면 경고 모달 on
      setIsEdit(!isEdit);
    }
  };

  return (
    <div>
      <ul style={{ height: "100vh" }}>
        {myBookReviews?.pages?.map((list: any) => {
          return list?.data.map((book: any, index: number) => {
            return (
              <li key={book.id}>
                <div>
                  {book?.title} - {book?.authors[0]}&nbsp;
                  {book.authors.length > 1 && "외"}
                </div>
                <div>{book?.price}원</div>
                <button onClick={() => showDetailReview(list.data[index])}>
                  상세보기
                </button>
              </li>
            );
          });
        })}
        <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          더보기
        </button>
      </ul>
    </div>
  );
};

export default ReviewItem;
