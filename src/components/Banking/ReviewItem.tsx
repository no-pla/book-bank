import React from "react";
import { useSetRecoilState } from "recoil";
import Image from "next/image";
import { selectMyBookState } from "@/share/atom";

const ReviewItem = ({ data }: any) => {
  const setMyBookData = useSetRecoilState(selectMyBookState);

  return (
    <div>
      {data?.pages?.map((list: any) => {
        return list?.data.map((book: any, index: number) => {
          return (
            <div key={book.id}>
              <Image
                src={book.thumbnail}
                width={100}
                height={150}
                alt={`${book?.title}의 표지입니다.`}
                priority={true}
              />
              <div>{book?.title}</div>
              <button onClick={() => setMyBookData(list.data[index])}>
                상세보기
              </button>
            </div>
          );
        });
      })}
    </div>
  );
};

export default ReviewItem;
