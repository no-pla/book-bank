import React, { useRef, useState } from "react";
import { useGetSearchBookList } from "../Hooks/useBanking";
import { useSetRecoilState } from "recoil";
import { selectBookState } from "@/share/atom";

const SearchForm = () => {
  const [page, setPage] = useState(1);
  const [searchBookName, setSearchBookName] = useState("");
  const SearchInputRef = useRef<HTMLInputElement>(null);
  const { data: bookList } = useGetSearchBookList(searchBookName, page);
  const setSelectBook = useSetRecoilState(selectBookState);

  const SearchInput = () => {
    return <input ref={SearchInputRef} />;
  };

  const onSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (SearchInputRef.current) {
      // enable를 false로 지정하면 invalidateQueries를 사용할 수 없으므로
      // 쿼리를 자동으로 업데이트하지 않기에 사용할 수 없으므로 setState를 사용
      setSearchBookName(SearchInputRef.current.value);
      setPage(1);
    }
  };
  console.log(bookList);

  return (
    <>
      <form onSubmit={(event) => onSearchSubmit(event)}>
        <SearchInput />
      </form>
      <ul>
        {bookList?.documents.map((book: any) => {
          return (
            <li key={book?.id} onClick={() => setSelectBook(book)}>
              {book.title}
            </li>
          );
        })}
      </ul>
      <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
        이전
      </button>
      <button
        disabled={bookList?.meta.is_end === true || bookList === undefined}
        onClick={() => setPage((prev) => prev + 1)}
      >
        이후
      </button>
    </>
  );
};

export default SearchForm;
