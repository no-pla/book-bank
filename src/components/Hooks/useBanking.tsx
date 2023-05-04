import axios from "axios";
import { v4 as uuid_v4 } from "uuid";
import { useQuery } from "react-query";

const REST_API_KEY = process.env.NEXT_PUBLIC_LIBRARY_KEY;

// 책 검색 페이지 도서 GET
export const useGetSearchBookList = (searchBookName: any, page: any) => {
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
