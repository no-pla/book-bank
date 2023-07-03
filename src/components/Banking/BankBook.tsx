import styled from "@emotion/styled";
import React, { useEffect } from "react";
import useUser from "../Hooks/useUser";
import { auth } from "@/share/firebase";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";

const BankBook = ({
  onClick,
  secondOnClick,
  text,
  secondText,
  transform,
  children,
}: any) => {
  const queryClient = useQueryClient();
  const router = useRouter();
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
    <BankingInfo>
      <BankName>{children}</BankName>
      <div>
        <BankAmount transform={transform}>
          <span>
            {router?.pathname === "/"
              ? userInfo
                  ?.reduce((cur: number, acc: any) => {
                    return cur + acc.price;
                  }, 0)
                  .toLocaleString("ko-KR") || 0
              : `${totalAmount}`}
          </span>
          <span>{router?.pathname == "/banking" && `(${totalBook}권)`}</span>
        </BankAmount>
      </div>

      <BankPage>
        <button onClick={onClick}>{text}</button>
        <button onClick={secondOnClick}>{secondText}</button>
      </BankPage>
    </BankingInfo>
  );
};

export default BankBook;

const BankingInfo = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 200px;
  border-radius: 12px;
  background-color: var(--sub-main-color);
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    width: 100%;
    height: 200px;
  }
`;

const BankName = styled.div`
  width: 100%;
  font-size: 0.9rem;
  box-sizing: border-box;
  padding: 0 20px;
  font-weight: 700;
`;

const BankAmount = styled.div<{ transform: number }>`
  font-weight: 800;
  font-size: 1.4rem;
  transform: translateY(40%);
  > span:first-of-type {
    padding: 8px;
    &::after {
      content: "원";
    }
  }
  @media (min-width: 768px) {
  }
`;

const BankPage = styled.div`
  > button {
    font-size: 0.9rem;
    background-color: transparent;
    border: none;
    padding: 0;
  }
  > button:first-of-type::after {
    content: "|";
    padding: 0 8px;
  }
`;
