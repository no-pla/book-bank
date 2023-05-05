import axios from "axios";
import React, { useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { DB_LINK } from "@/share/server";
import useUser from "@/components/Hooks/useUser";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import EditForm from "@/components/Banking/EditForm";
import ReviewItem from "@/components/Banking/ReviewItem";
import ReviewDetailItem from "@/components/Banking/ReviewDetailItem";
import styled from "@emotion/styled";

const Index = ({ currentUser }: any) => {
  const queryClient = useQueryClient();
  const resetList = useResetRecoilState(selectMyBookState);
  const userInfo = useUser(currentUser?.uid);
  const MAX_BOOK = 10;
  const isEdit = useRecoilValue(isFormEdit);
  const resetEdit = useResetRecoilState(isFormEdit);

  const { data, fetchNextPage, hasNextPage, remove } = useInfiniteQuery(
    ["getMyBookList", currentUser?.uid],
    ({ pageParam = 1 }) => fetchBookList(pageParam, currentUser?.uid),
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

  const fetchBookList = async (pageParam: number = 1, userId: string) => {
    return await axios.get(
      `${DB_LINK}/review?_sort=createdAt&_order=desc&_limit=${MAX_BOOK}&_page=${pageParam}&_uid=${userId}`
    );
  };

  const getNextPage = () => {
    fetchNextPage();
    if (isEdit === true) {
      resetEdit();
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo"); // 도서 입금 후 제대로 뜨지 않는 경우가 있어서 수정
    resetList(); // 옆 상세 페이지 닫기
    remove(); // pageParams 리셋용
    resetEdit();
  }, []);

  return (
    <Container>
      <div>
        <ReviewItem data={data} />
        <button disabled={!hasNextPage} onClick={getNextPage}>
          더보기
        </button>
      </div>
      <div>{isEdit ? <EditForm /> : <ReviewDetailItem />}</div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  > div:first-of-type {
    background-color: #33ff33;
  }
  > div:nth-of-type(2) {
    background-color: magenta;
    flex-grow: 1;
  }
`;

export default Index;
