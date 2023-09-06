import React, { useRef, useState } from "react";
import Image from "next/image";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import axios from "axios";
import styled from "@emotion/styled";
import { v4 as uuid_v4 } from "uuid";
import CustomButton from "../../Custom/CustomButton";
import { NO_IMAGE } from "@/share/server";
import { selectBookState, userDirectFormState } from "@/share/atom";
import { useQuery } from "react-query";
import { StyleInput } from "@/components/Custom/Input";

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

interface IBookData {
  data: {
    documents: IBook[];
    meta: {
      is_end: boolean;
      pageable_count: number;
      total_count: number;
    };
  };
}

const REST_API_KEY = process.env.NEXT_PUBLIC_LIBRARY_KEY;

const SearchForm = () => {
  const [page, setPage] = useState<number>(1);
  const [searchBookName, setSearchBookName] = useState<string>("");
  const SearchInputRef = useRef<HTMLInputElement>(null);
  const setSelectBook = useSetRecoilState(selectBookState);
  const resetSelectBook = useResetRecoilState(selectBookState);
  const setToggleDirectFormState = useSetRecoilState(userDirectFormState);

  const SearchInput = () => {
    return (
      <StyleInput
        ref={SearchInputRef}
        placeholder="검색할 책을 입력해주세요."
      />
    );
  };

  const fetchBookList = async (page: number) => {
    return await axios.get(
      `https://dapi.kakao.com/v3/search/book?sort=accuracy&page=${page}&size=20&query=${searchBookName}`,
      {
        headers: {
          Authorization: `KakaoAK ${REST_API_KEY}`,
        },
      }
    );
  };

  const { data: bookList } = useQuery(
    ["bookData", searchBookName, page],
    () => fetchBookList(page),
    {
      keepPreviousData: true,
      enabled: !!searchBookName,
      select: ({ data }: IBookData) => {
        const modifiedData = data.documents.map((book: IBook) => {
          // 불변성을 유지하기 위하여 id값을 추가하고 리턴
          return { ...book, id: uuid_v4() };
        });
        return { documents: modifiedData, meta: data.meta };
      },
    }
  );

  const onSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (SearchInputRef.current) {
      // enable를 false로 지정하면 invalidateQueries를 사용할 수 없으므로
      // 쿼리를 자동으로 업데이트하지 않기에 사용할 수 없으므로 setState를 사용
      setSearchBookName(SearchInputRef.current.value);
      setPage(1);
    }
  };

  const onClick = (book: IBook) => {
    setSelectBook(book);
    setToggleDirectFormState(false);
  };
  const onClickDirectForm = () => {
    resetSelectBook();
    setToggleDirectFormState(true);
  };

  return (
    <Container>
      <div>
        <Form onSubmit={(event) => onSearchSubmit(event)}>
          <SearchInput />
        </Form>
        <BookListItemContainer>
          {bookList?.documents?.length !== 0 ? (
            bookList?.documents.map((book: IBook) => {
              return (
                <BookListItem key={book.id} onClick={() => onClick(book)}>
                  <Image
                    src={book.thumbnail || NO_IMAGE}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "20%", height: "auto" }}
                    alt={`${book.title}의 책표지입니다. `}
                  />
                  <BookDescription>
                    <BookTitle>{book.title}</BookTitle>
                    <div>
                      {book.authors[0] || "정보 없음"}
                      {book.authors.length > 1 && "외"}
                      &nbsp;|&nbsp;{book.publisher || "정보 없음"}
                    </div>
                    <BookPrice>{book.price.toLocaleString()}</BookPrice>
                  </BookDescription>
                </BookListItem>
              );
            })
          ) : (
            <NoResult>
              <h2>검색 결과가 없습니다.</h2>
              <CustomButton value="직접 입력하기" onClick={onClickDirectForm} />
            </NoResult>
          )}
        </BookListItemContainer>
      </div>
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

const Form = styled.form`
  position: sticky;
  top: -20px;
  background-color: var(--sub-main-color);
  padding: 20px 0 12px 0;
  box-sizing: border-box;
`;

const NoResult = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  font-size: 1rem;
  > button {
    padding: 12px 32px;
    background-color: whitesmoke;
    border-radius: 12px;
    border: 1px solid lightgray;
    cursor: pointer;
  }
`;

const Container = styled.div`
  overflow: auto;
  > button {
    border: 1px solid lightgrey;
    width: 50%;
    cursor: pointer;
    padding: 4px 0;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const BookListItemContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
  box-sizing: border-box;
`;

export const BookListItem = styled.li`
  display: flex;
  gap: 12px;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  align-items: flex-start;
  background-color: whitesmoke;
  @media (max-width: 600px) {
    > img {
      display: none;
    }
  }
`;

export const BookTitle = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
  font-size: 1.1rem;
  padding-top: 8px;
  @media (max-width: 600px) {
    padding-top: 0;
  }
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
  align-items: flex-start;
  gap: 8px;
  > div:nth-of-type(2),
  div:last-of-type {
    font-size: 0.9rem;
  }
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
