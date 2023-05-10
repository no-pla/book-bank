import React from "react";
import styled from "@emotion/styled";
import { useSetRecoilState } from "recoil";
import { selectBookState } from "@/share/atom";
import Image from "next/image";

const BookItem = ({ book }: any) => {
  const setSelectBook = useSetRecoilState(selectBookState);
  console.log(book);

  return (
    <BookListItem key={book?.id} onClick={() => setSelectBook(book)}>
      <Image
        src={book.thumbnail}
        width={100}
        height={150}
        alt={`${book.title}의 책표지입니다.`}
      />
      <BookDescription>
        <BookTitle>{book.title}</BookTitle>
        <div>{book.authors[0] || "정보 없음"}</div>
        <div>{book.publisher || "정보 없음"}</div>
        <div>{book.price.toLocaleString("ko-KR")}원</div>
      </BookDescription>
    </BookListItem>
  );
};

export default BookItem;

const BookListItem = styled.li`
  background-color: whitesmoke;
  padding: 12px 0 12px 12px;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  cursor: pointer;
`;

const BookDescription = styled.div`
  width: 100%;
  > div:nth-of-type(2)::before {
    content: "작가: ";
  }
  > div:nth-of-type(3)::before {
    content: "출판사: ";
  }
  > div:nth-of-type(3) {
    margin: 8px 0;
  }
`;

const BookTitle = styled.div`
  font-weight: 800;
  margin: 8px 0;
`;
