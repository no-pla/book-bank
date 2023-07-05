import axios from "axios";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useResetRecoilState } from "recoil";
import { DB_LINK } from "@/share/server";
import { selectMyBookState } from "@/share/atom";

// 독서 입금 Create
const addBook = async (newBookReview: any) => {
  try {
    await axios.post(`${DB_LINK}/review`, newBookReview);
  } catch (error) {
    console.log(error);
  }
};

export const useAddBook = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries("getMyBookList");
      router.push("/banking");
    },
  });
};

// 독서 입금 Read (내역 페이지)
export const useGetBookList = (userId: string) => {
  return useInfiniteQuery(
    "getMyBookList",
    ({ pageParam = 1 }) => fetchBookList(pageParam, userId),
    {
      enabled: !!userId,
    }
  );
};

const fetchBookList = async (pageParam: number, userId: string) => {
  return await axios.get(
    `${DB_LINK}/review?_limit=2&_page=${pageParam}&_userId=${userId}`
  );
};

// 독서 입금 Update
const updateBook = async (bookInfo: any) => {
  try {
    await axios.patch(`${DB_LINK}/review/${bookInfo?.id}`, bookInfo);
  } catch (error) {
    console.log(error);
  }
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBook,
    onSuccess: async () => {
      await queryClient.invalidateQueries("getMyBookList");
      await queryClient.invalidateQueries("getReadBookInfo");
    },
  });
};
// 독서 입금 Delete

// 책 삭제
const deleteBook = async (targetId: string) => {
  // 책 데이터 삭제
  try {
    await axios.delete(`${DB_LINK}/review/${targetId}`);
  } catch (error) {
    console.log(error);
  }
  // 유저 데이터 책 개수 빼기
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  const resetList = useResetRecoilState(selectMyBookState);

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: async () => {
      await queryClient.invalidateQueries("getReadBookInfo");
      await queryClient.invalidateQueries("getMyBookList");
      resetList();
    },
  });
};
