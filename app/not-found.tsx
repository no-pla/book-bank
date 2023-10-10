"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import React from "react";
import { Helmet } from "react-helmet-async";

const Error = () => {
  return (
    <Container>
      <Helmet>
        <title>Book Bank / 404</title>
      </Helmet>
      <h1>존재하지 않는 페이지입니다. 😥</h1>
      <Link href="/">&rarr;&nbsp;메인 페이지로 돌아가기</Link>
    </Container>
  );
};

export default Error;

const Container = styled.div`
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
  > h1 {
    font-size: 1rem;
  }
  > a {
    font-size: 0.8rem;
    border: 1px solid gray;
    padding: 12px 20px;
    border-radius: 20px;
    box-shadow: -1px 6px 7px 3px rgba(209, 198, 198, 0.62);
    -webkit-box-shadow: -1px 6px 7px 3px rgba(209, 198, 198, 0.62);
    -moz-box-shadow: -1px 6px 7px 3px rgba(209, 198, 198, 0.62);
  }
`;
