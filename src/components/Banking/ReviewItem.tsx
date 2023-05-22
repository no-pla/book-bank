import React, from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { useInfiniteQuery } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useUser from "../Hooks/useUser";
import { DB_LINK } from "@/share/server";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import { BookDesc } from "./ReviewForm";
import { BookListItem } from "./SearchForm";
import useAuth from "../Hooks/useAuth";

const ReviewItem = () => {
  const currentUser = useAuth();
  const userInfo = useUser(currentUser?.uid);
  const MAX_BOOK = 10;
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
      `${DB_LINK}/review?_sort=createdAt&_order=desc&_limit=${MAX_BOOK}&_page=${pageParam}&uid=${currentUser?.uid}`
    );
  };

  const showDetailReview = (data: any) => {
    setMyBookData(data);
    if (isEdit) {
      // 수정 폼이 열린 상태로 상세보기를 누르면 경고 모달 on
      setIsEdit(!isEdit);
    }
  };

  console.log(myBookReviews);

  return (
    <BookListContainer>
      <ul>
        {myBookReviews?.pages?.map((list: any) => {
          return list?.data.map((book: any) => {
            return (
              <BookListItem
                key={book.id}
                onClick={() => showDetailReview(book)}
              >
                <BookDescription>
                  <BookTitle>{book.title}</BookTitle>
                  <BookDescription>
                    <BookDesc>
                      <div>
                        {book.authors[0] || "정보 없음"}
                        {book.authors.length > 1 && " 외"}
                        &nbsp;|&nbsp;{book.publisher}
                      </div>
                      <BookPrice>{book.price.toLocaleString()}</BookPrice>
                    </BookDesc>
                  </BookDescription>
                </BookDescription>
              </BookListItem>
            );
          });
        })}
      </ul>
      <NextButton disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        더보기
      </NextButton>
    </BookListContainer>
  );
};

export default ReviewItem;

const NextButton = styled.button`
  padding: 8px 12px;
  background-color: whitesmoke;
  border-radius: 12px;
  border: 1px solid lightgray;
  cursor: pointer;
`;

const BookListContainer = styled.div`
  height: calc(100% - 160px);
  background-color: #bfb0d1;
  padding: 32px 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  > ul {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: scroll;
  gap: 12px;
`;

const BookDescription = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  > button {
    border: 1px solid var(--main-color);
    color: var(--text-color);
  }
`;

const BookTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  padding-bottom: 8px;
`;

const BookPrice = styled.div`
  margin: 4px 0;
`;
