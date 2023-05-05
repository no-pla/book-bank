import axios from "axios";
import { v4 as uuid_v4 } from "uuid";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { DB_LINK } from "@/share/server";
import { useResetRecoilState } from "recoil";
import { selectMyBookState } from "@/share/atom";

const REST_API_KEY = process.env.NEXT_PUBLIC_LIBRARY_KEY;

// 책 검색 페이지 도서 GET
export const useGetSearchBookList = (searchBookName: string, page: number) => {
  const { data } = useQuery(
    ["bookData", searchBookName, page],
    async () => {
      return await axios.get(
        `https://dapi.kakao.com/v3/search/book?sort=accuracy&page=${page}&size=20&query=${searchBookName}`,
        {
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
          },
        }
      );
    },
    {
      keepPreviousData: true,
      enabled: !!searchBookName,
      select: (data) => {
        // 불변성을 유지하기 위하여 id값을 추가하고 리턴
        const modifiedData = data.data.documents.map((book: any) => {
          // forEach는 리턴 값이 없으므로 사용하면 안된다.
          return { ...book, id: uuid_v4() };
        });
        return { documents: modifiedData, meta: data.data.meta };
      },
    }
  );
  return { data };
};

// 독서 입금 Create
const addBook = async (newBookReview: any) => {
  try {
    await axios.post(`${DB_LINK}/review`, newBookReview);
  } catch (error) {
    console.log(error);
  }
};

export const useAddBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries("getMyBookList");
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
  console.log(userId);

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
    onSuccess: () => {
      queryClient.invalidateQueries("getMyBookList");
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
    alert("삭제를 실패했습니다.");
    console.log(error);
  }
  // 유저 데이터 책 개수 빼기
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  const resetList = useResetRecoilState(selectMyBookState);

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries("getMyBookList");
      resetList();
    },
  });
};
