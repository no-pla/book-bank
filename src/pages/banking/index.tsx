import useUser from "@/components/Hooks/useUser";
import { selectMyBookState } from "@/share/atom";
import { DB_LINK } from "@/share/server";
import axios from "axios";
import Image from "next/image";
import React, { useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";

const Index = ({ currentUser }: any) => {
  const queryClient = useQueryClient();
  const userInfo = useUser(currentUser?.uid);
  const setMyBookData = useSetRecoilState(selectMyBookState);
  const targetMyBookData = useRecoilValue(selectMyBookState);
  const MAX_BOOK = 10;
  console.log(targetMyBookData);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    "getMyBookList",
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

  const fetchBookList = async (pageParam: number, userId: string) => {
    return await axios.get(
      `${DB_LINK}/review?_limit=${MAX_BOOK}&_page=${pageParam}&_uid=${userId}`
    );
  };

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo");
  }, []);

  return (
    <>
      <div>{userInfo?.length.toLocaleString("ko-KR")}권</div>
      <div>
        {data?.pages?.map((list: any) => {
          return list?.data.map((book: any, index: number) => {
            return (
              <div
                key={book.id}
                onClick={() => setMyBookData(list.data[index])}
              >
                <Image
                  src={book.thumbnail}
                  width={100}
                  height={150}
                  alt={`${book?.title}의 표지입니다.`}
                />
                <div>{book?.title}</div>
                <button>상세보기</button>
              </div>
            );
          });
        })}
      </div>
      <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        더보기
      </button>
    </>
  );
};

export default Index;
