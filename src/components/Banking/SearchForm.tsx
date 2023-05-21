import React, { useRef, useState } from "react";
import Image from "next/image";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import styled from "@emotion/styled";
import { Input } from "../Custom/AuthInput";
import CustomButton from "../Custom/CustomButton";
import { useGetSearchBookList } from "../Hooks/useBanking";
import { selectBookState, userDirectFormState } from "@/share/atom";
import { NO_IMAGE } from "@/share/server";

interface IBook {
  authors: string[];
  contents: string;
  datetime: string;
  id: string;
  isbn: string;
  price: number;
  publisher: string;
  sale_price: number;
  status: string;
  thumbnail: string;
  title: string;
  translators: string[];
  url: string;
}

const SearchForm = () => {
  const [page, setPage] = useState<number>(1);
  const [searchBookName, setSearchBookName] = useState("");
  const SearchInputRef = useRef<HTMLInputElement>(null);
  const { data: bookList } = useGetSearchBookList(searchBookName, page);
  const setSelectBook = useSetRecoilState(selectBookState);
  const resetSelectBook = useResetRecoilState(selectBookState);
  const setToggleDirectFormState = useSetRecoilState(userDirectFormState);
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

  const onClick = (book: any) => {
    setSelectBook(book);
    setToggleDirectFormState(false);
  };
  const onClickDirectForm = () => {
    resetSelectBook();
    setToggleDirectFormState(true);
  };

  return (
    <Container>
      <form onSubmit={(event) => onSearchSubmit(event)}>
        <SearchInput />
      </form>
      <BookListItemContainer>
        {bookList?.documents?.length !== 0 ? (
          bookList?.documents.map((book: IBook) => {
            return (
              <BookListItem key={book.id} onClick={() => onClick(book)}>
                <Image
                  src={book.thumbnail || NO_IMAGE}
                  height={80}
                  width={60}
                  alt={`${book.title}의 책표지입니다. `}
                />
                <BookDescription>
                  <BookTitle>{book.title}</BookTitle>
                  <div>
                    {book.authors[0] || "정보 없음"}
                    {book.authors.length > 1 && "외"}
                    &nbsp;|&nbsp;{book.publisher}
                  </div>
                  <BookPrice>{book.price.toLocaleString()}</BookPrice>
                </BookDescription>
              </BookListItem>
            );
          })
        ) : (
          <NoResult>
            <h2>검색 결과가 없습니다.</h2>
            <button onClick={onClickDirectForm}>직접 입력하기</button>
          </NoResult>
        )}
      </BookListItemContainer>
      <SearchButtonContainer>
        <CustomButton
          value="이전"
          disabled={page === 1 || !bookList}
          onClick={() => setPage((prev) => prev - 1)}
        />
        <CustomButton
          value="이후"
          disabled={bookList?.meta?.is_end || !bookList}
          onClick={() => setPage((prev) => prev + 1)}
        />
      </SearchButtonContainer>
    </Container>
  );
};

const NoResult = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  > button {
    padding: 12px 32px;
    background-color: whitesmoke;
    border-radius: 12px;
    border: 1px solid lightgray;
    cursor: pointer;
  }
`;

const Container = styled.div`
  height: 100%;
  > button {
    border: 1px solid lightgrey;
    width: 50%;
    cursor: pointer;
    padding: 4px 0;
  }
`;

const BookListItemContainer = styled.ul`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: scroll;
  height: 88%;
  box-sizing: border-box;
`;

export const BookListItem = styled.li`
  background-color: white;
  display: flex;
  gap: 12px;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  align-items: flex-end;
`;

export const BookTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
`;

export const BookPrice = styled.div`
  &::after {
    content: "원";
  }
`;

export const BookDescription = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
`;

const SearchButtonContainer = styled.div`
  > button {
    width: 50%;
    color: var(--main-color);
    border: 1px solid var(--main-color);
  }

  > button:disabled {
    color: darkgray;
    background-color: lightgray;
    border: 1px solid darkgray;
  }
`;

export default SearchForm;
