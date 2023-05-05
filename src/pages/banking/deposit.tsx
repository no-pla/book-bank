import React, { useEffect, useState } from "react";
import { useResetRecoilState } from "recoil";
import { selectBookState } from "@/share/atom";
import SearchForm from "@/components/Banking/SearchForm";
import ReviewForm from "@/components/Banking/ReviewForm";

const Deposit = () => {
  const resetList = useResetRecoilState(selectBookState);

  useEffect(() => {
    resetList();
  }, []);

  return (
    <>
      <SearchForm />
      <ReviewForm />
    </>
  );
};

export default Deposit;
