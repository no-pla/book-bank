import React, { useEffect } from "react";
import { useResetRecoilState } from "recoil";
import { selectBookState } from "@/share/atom";
import styled from "@emotion/styled";
import SearchForm from "@/components/Banking/SearchForm";
import ReviewForm from "@/components/Banking/ReviewForm";

const Deposit = () => {
  const resetList = useResetRecoilState(selectBookState);

  useEffect(() => {
    resetList();
  }, []);

  return (
    <DepositContainer>
      <SearchForm />
      <ReviewForm />
    </DepositContainer>
  );
};

const DepositContainer = styled.div`
  display: flex;
  height: 100%;
  gap: 20px;
  > div {
    width: 50%;
    background-color: #bfb0d1;
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;

    height: 100%;
  }
  @media (max-width: 600px) {
    align-items: flex-end;
    > section {
      height: 94vh;
    }
  }
`;

export default Deposit;
