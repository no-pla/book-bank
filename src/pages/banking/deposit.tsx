import React, { useEffect } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import styled from "@emotion/styled";
import SearchForm from "@/components/Banking/SearchForm";
import ReviewForm from "@/components/Banking/ReviewForm";
import { selectBookState, userDirectFormState } from "@/share/atom";

const Deposit = () => {
  const resetList = useResetRecoilState(selectBookState);
  const resetDirectList = useResetRecoilState(userDirectFormState);
  const targetBookData = useRecoilValue<any>(selectBookState);
  const userDirectFormData = useRecoilValue(userDirectFormState);

  useEffect(() => {
    resetList();
    resetDirectList();
  }, []);

  return (
    <DepositContainer
      show={
        Object.keys(targetBookData).length > 0 || userDirectFormData
          ? "block"
          : "none"
      }
    >
      <SearchForm />
      <ReviewForm />
    </DepositContainer>
  );
};

const DepositContainer = styled.div<{ show: string }>`
  display: flex;
  height: 100%;
  gap: 20px;
  position: relative;
  > div {
    width: 50%;
    background-color: #bfb0d1;
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;
    display: block;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: scroll;
  }
  @media (max-width: 600px) {
    > div:first-of-type {
      width: 100%;
    }
    > div:last-of-type {
      width: 100%;
      display: ${(props) => props.show};
    }
  }
`;

export default Deposit;
