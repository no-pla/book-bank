import styled from "@emotion/styled";
import React, { useEffect } from "react";
import useUser from "../Hooks/useUser";
import { auth } from "@/share/firebase";
import { useQueryClient } from "react-query";

const BankBook = ({
  onclick,
  secondOnClick,
  text,
  secondText,
  transform,
}: any) => {
  const queryClient = useQueryClient();
  const userInfo = useUser(auth.currentUser?.uid!);
  const totalBook = userInfo?.length || 0;
  const totalAmount =
    userInfo
      ?.reduce((cur: number, acc: any) => {
        return cur + acc.price;
      }, 0)
      .toLocaleString("ko-KR") || 0;

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo");
  }, []);

  return (
    <>
      <BankBookInfo transform={transform}>
        {totalAmount}원&nbsp;({totalBook}권)
      </BankBookInfo>
      <BankBookInfoButtonContainer>
        <button onClick={onclick}>{text}</button>
        <button onClick={secondOnClick}>{secondText}</button>
      </BankBookInfoButtonContainer>
    </>
  );
};

export default BankBook;

const BankBookInfo = styled.div<{ transform: number }>`
  font-weight: 800;
  font-size: 1.8rem;
  transform: translateY(${(props) => props.transform});
`;

const BankBookInfoButtonContainer = styled.div`
  width: 100%;
  > button {
    width: 50%;
    padding: 2px 4px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-weight: 300;
    font-size: 1.2rem;
  }
  > button:first-of-type {
    border-right: 1px solid lightgray;
  }
`;
