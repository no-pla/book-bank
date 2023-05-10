import React from "react";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useInfiniteQuery } from "react-query";
import { DB_LINK } from "@/share/server";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import styled from "@emotion/styled";
import Image from "next/image";
import useUser from "../Hooks/useUser";

const ReviewItem = ({ currentUser }: any) => {
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
      `${DB_LINK}/review?_sort=createdAt&_order=desc&_limit=${MAX_BOOK}&_page=${pageParam}&_uid=${currentUser?.uid}`
    );
  };

  const showDetailReview = (data: any) => {
    setMyBookData(data);
    if (isEdit) {
      // 수정 폼이 열린 상태로 상세보기를 누르면 경고 모달 on
      setIsEdit(!isEdit);
    }
  };

  return (
    <ReivewItemContainer>
      <ReviewListItemContainer>
        {myBookReviews?.pages?.map((list: any) => {
          return list?.data.map((book: any, index: number) => {
            return (
              <ReviewListItem key={book.id}>
                <Image
                  src={book.thumbnail}
                  width={80}
                  height={120}
                  alt={`${book.title}의 책표지입니다.`}
                />
                <BookDescription>
                  <BookTitle>{book?.title}</BookTitle>
                  <div>
                    {book?.authors[0]}&nbsp;
                    {book.authors.length > 1 && "외"}
                  </div>
                  <BookPrice>
                    {book?.price?.toLocaleString("ko-KR")}원
                  </BookPrice>
                  <ShowDetailButton
                    onClick={() => showDetailReview(list.data[index])}
                  >
                    상세보기
                  </ShowDetailButton>
                </BookDescription>
              </ReviewListItem>
            );
          });
        })}
      </ReviewListItemContainer>
      <GetNextPageButton
        disabled={!hasNextPage}
        onClick={() => fetchNextPage()}
      >
        더보기
      </GetNextPageButton>
    </ReivewItemContainer>
  );
};

export default ReviewItem;

const ReivewItemContainer = styled.div`
  overflow-y: scroll;
`;

const ReviewListItemContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-right: 1px solid lightgray;
`;

const ReviewListItem = styled.li`
  background-color: whitesmoke;
  display: flex;
  padding: 8px;
  border-radius: 8px;
  > img {
    margin-right: 12px;
  }
  > div {
    margin-top: 4px;
  }
`;

const BookDescription = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BookTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  padding-bottom: 8px;
`;

const BookPrice = styled.div`
  margin: 4px 0;
`;

const ShowDetailButton = styled.button`
  cursor: pointer;
  padding: 4px 8px;
`;

const GetNextPageButton = styled.button`
  padding: 12px;
  width: 100%;
  border: 1px solid lightgray;
  cursor: pointer;
`;
