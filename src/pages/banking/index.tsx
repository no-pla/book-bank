import axios from "axios";
import React, { useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { DB_LINK } from "@/share/server";
import useUser from "@/components/Hooks/useUser";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import EditForm from "@/components/Banking/EditForm";
import ReviewItem from "@/components/Banking/ReviewItem";
import ReviewDetailItem from "@/components/Banking/ReviewDetailItem";
import styled from "@emotion/styled";
import ErrorModal from "@/components/Custom/ErrorModal";
import useModal from "@/components/Hooks/useModal";
import { useDeleteBook } from "@/components/Hooks/useBanking";
import { useRouter } from "next/router";

const Index = ({ currentUser }: any) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const resetList = useResetRecoilState(selectMyBookState);
  const userInfo = useUser(currentUser?.uid);
  const isEdit = useRecoilValue(isFormEdit);
  const resetEdit = useResetRecoilState(isFormEdit);
  const { mutate: deleteReview } = useDeleteBook();
  const { isShowing, toggle } = useModal();
  const { isShowing: editIsShowing, toggle: editToggle } = useModal();
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const MAX_BOOK = 3;

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

  const onDelete = async () => {
    await deleteReview(targetMyBookData?.id);
    toggle();
  };

  const getNextPage = () => {
    fetchNextPage();
    if (isEdit) {
      resetEdit();
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo"); // 도서 입금 후 제대로 뜨지 않는 경우가 있어서 수정
    resetList(); // 옆 상세 페이지 닫기
    remove(); // pageParams 리셋용
    resetEdit();
  }, []);

  const calcelEdit = () => {
    editToggle();
    setIsEdit((prev) => !prev);
  };

  const setIsEdit = useSetRecoilState(isFormEdit);

  useEffect(() => {
    console.log("0410");
  }, [router.pathname]);

  return (
    <>
      {isShowing && (
        <ErrorModal
          title="정말로 삭제할까요?"
          content="이 작업은 되돌릴 수 없습니다!"
          isShowing={isShowing}
          toggle={toggle}
          onFunc={onDelete}
        />
      )}
      {editIsShowing && (
        <ErrorModal
          title="정말로 수정을 취소할까요?"
          content="이 작업은 되돌릴 수 없습니다!"
          isShowing={editIsShowing}
          toggle={editToggle}
          onFunc={() => calcelEdit()}
        />
      )}
      <Container>
        <ReviewItem
          data={data}
          hasNextPage={hasNextPage}
          getNextPage={getNextPage}
        />
        {isEdit ? (
          <EditForm editToggle={editToggle} editIsShowing={editIsShowing} />
        ) : (
          <ReviewDetailItem toggle={toggle} />
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  > div:first-of-type {
    background-color: #33ff33;
    flex-grow: 1;
  }

  > div:nth-of-type(2) {
    background-color: magenta;
    flex-grow: 1;
  }
`;

export default Index;
