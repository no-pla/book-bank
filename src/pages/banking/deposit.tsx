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
  width: 100vw;
  height: 100vh;
  > * {
    width: 50%;
  }
  @media (max-width: 600px) {
    align-items: flex-end;
    > section {
      height: 92vh;
    }
  }
`;

export default Deposit;
