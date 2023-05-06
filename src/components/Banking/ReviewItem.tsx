import React from "react";
import { useSetRecoilState } from "recoil";
import Image from "next/image";
import { selectMyBookState } from "@/share/atom";
import styled from "@emotion/styled";

const ReviewItem = ({ data, hasNextPage, getNextPage, toggle }: any) => {
  const setMyBookData = useSetRecoilState(selectMyBookState);

  console.log(data);

  return (
    <ReviewItemContainer>
      {data?.pages?.map((list: any) => {
        return list?.data.map((book: any, index: number) => {
          return (
            <Review key={book.id}>
              <div>
                {book?.title} - {book?.authors[0]}
              </div>
              <div>{book?.price}원</div>
              <button onClick={() => setMyBookData(list.data[index])}>
                상세보기
              </button>
            </Review>
          );
        });
      })}
      <button disabled={!hasNextPage} onClick={getNextPage}>
        더보기
      </button>
    </ReviewItemContainer>
  );
};

const ReviewItemContainer = styled.ul`
  height: 100vh;
  overflow-y: hidden;
`;

const Review = styled.li`
  color: whitesmoke;
  background-color: #393b4c;
`;

export default ReviewItem;
