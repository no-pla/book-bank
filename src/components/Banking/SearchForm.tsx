import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import BookItem from "./BookItem";
import { Input } from "../Custom/AuthInput";
import CustomButton from "../Custom/CustomButton";
import { useGetSearchBookList } from "../Hooks/useBanking";

const SearchForm = () => {
  const [page, setPage] = useState<number>(1);
  const [searchBookName, setSearchBookName] = useState("");
  const SearchInputRef = useRef<HTMLInputElement>(null);
  const { data: bookList } = useGetSearchBookList(searchBookName, page);

  const SearchInput = () => {
    return (
      <Input ref={SearchInputRef} placeholder="검색할 책을 입력해주세요." />
    );
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

  return (
    <Container>
      <form onSubmit={(event) => onSearchSubmit(event)}>
        <SearchInput />
      </form>
      <BookListContainer>
        {bookList?.documents.map((book: any) => {
          return <BookItem key={book.id} book={book} />;
        })}
      </BookListContainer>
      <SearchButtonContainer>
        <CustomButton
          value="이전"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        />

        <CustomButton
          value="이후"
          disabled={bookList?.meta.is_end === true || bookList === undefined}
          onClick={() => setPage((prev) => prev + 1)}
        />
      </SearchButtonContainer>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: flex-start;
`;

const BookListContainer = styled.ul`
  height: 100%;
  padding: 12px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SearchButtonContainer = styled.div`
  > button {
    width: 50%;
    color: var(--point-color1);
    border: 1px solid var(--point-color1);
  }
  > button:disabled {
    color: var(--main-color);
    border: 1px solid var(--main-color);
  }
`;

export default SearchForm;
