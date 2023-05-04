import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "@emotion/styled";
import { selectBookState } from "@/share/atom";
import { useGetSearchBookList } from "@/components/Hooks/useBanking";
import Image from "next/image";

const Deposit = () => {
  const [page, setPage] = useState(1);
  const [searchBookName, setSearchBookName] = useState("");
  const SearchInputRef = useRef<HTMLInputElement>(null);
  const ReviewAreaRef = useRef<HTMLTextAreaElement>(null);
  const setSelectBook = useSetRecoilState(selectBookState);
  const targetBookData = useRecoilValue<any>(selectBookState);
  const { data: bookList } = useGetSearchBookList(searchBookName, page);

  const SearchInput = () => {
    return <input ref={SearchInputRef} />;
  };

  const ReviewArea = () => {
    return (
      <TextArea ref={ReviewAreaRef} placeholder="후기를 적어주세요. (선택)" />
    );
  };

  const onSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (SearchInputRef.current) {
      // enable를 false로 지정하면 invalidateQueries를
      // 쿼리를 자동으로 업데이트하지 않기에 사용할 수 없으므로 setState를 사용
      setSearchBookName(SearchInputRef.current.value);
      setPage(1);
    }
  };

  return (
    <>
      <DepositContainer>
        <Section>
          <form onSubmit={(event) => onSearchSubmit(event)}>
            <SearchInput />
          </form>
          <ul>
            {bookList?.documents.map((bookInfo: any, index: number) => {
              return (
                <li
                  key={bookInfo.id}
                  onClick={() => setSelectBook(bookList.documents[index])}
                >
                  <div>{bookInfo.title}</div>
                </li>
              );
            })}
          </ul>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            이전
          </button>
          <button
            disabled={bookList?.meta.is_end === true || bookList === undefined}
            onClick={() => setPage((prev) => prev + 1)}
          >
            이후
          </button>
        </Section>
        <Section>
          {Object.keys(targetBookData).length > 0 && (
            <form onSubmit={(event) => console.log(event)}>
              <div>{targetBookData?.title}</div>
              <div>{targetBookData.authors}</div>
              <Image
                src={targetBookData.thumbnail}
                alt={`${targetBookData.title}의 책표지입니다.`}
                width={100}
                height={150}
              />
              <ReviewArea />
              <button>책 저금하기</button>
            </form>
          )}
        </Section>
      </DepositContainer>
    </>
  );
};

const TextArea = styled.textarea`
  resize: none;
  height: 300px;
`;

const DepositContainer = styled.div`
  display: flex;
  height: 100%;
  > * {
    flex: 1;
  }
`;

const Section = styled.section``;

export default Deposit;
