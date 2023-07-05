import React from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { useInfiniteQuery } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BookDesc } from "./Form/ReviewForm";
import { BookListItem } from "./Form/SearchForm";
import useAuth from "../Hooks/useAuth";
import useUser from "../Hooks/useUser";
import { DB_LINK } from "@/share/server";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import ConfirmModal from "../Custom/ConfirmModal";
import useModal from "../Hooks/useModal";

interface IMyBook {
  title: string;
  publisher: string;
  price: number;
  id: string;
  authors: string[];
  createdAt: number;
  createdDay: number;
  createdMonth: number;
  createdYear: number;
  review: string;
  thumbnail: string;
}

const ReviewItem = () => {
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
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
      select: (data) => {
        // 불변성을 유지하기 위하여 id값을 추가하고 리턴
        const modifiedData = data.pages.map((book: any) => {
          // 필요 없는 데이터 제외 후 리턴
          return book?.data;
        });
        return { pages: modifiedData, pageParams: data.pageParams };
      },
    }
  );

  const fetchMyBookReivewList = async (pageParam: number) => {
    return await axios.get(
      `${DB_LINK}/review?_sort=createdAt&_order=desc&_limit=${MAX_BOOK}&_page=${pageParam}&uid=${currentUser?.uid}`
    );
  };

  const showDetailReview = (data: IMyBook) => {
    if (isEdit) {
      toggle();
      return;
      // 수정 폼이 열린 상태로 상세보기를 누르면 경고 모달 on
    }
    setMyBookData(data);
  };

  return (
    <BookListContainer>
      {isShowing && (
        <ConfirmModal
          title="정말로 수정을 취소할까요?"
          content="이 작업은 되돌릴 수 없습니다!"
          toggle={toggle}
          onFunc={() => {
            setIsEdit((prev) => !prev);
            toggle();
          }}
        />
      )}
      <ul>
        {myBookReviews?.pages?.map((list: IMyBook[]) => {
          return list?.map((book: IMyBook) => {
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
  font-weight: 100;
  font-size: 1rem;
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
  gap: 12px;
  overflow-y: scroll;
`;

const BookDescription = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-weight: 100;
  > button {
    border: 1px solid var(--main-color);
    color: var(--text-color);
  }
`;

const BookTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 400;
  padding-bottom: 8px;
`;

const BookPrice = styled.div`
  margin: 4px 0;
`;
