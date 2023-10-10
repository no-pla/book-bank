"use client";

import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";

interface Props {
  children: ReactNode;
}

const template = ({ children }: Props) => {
  return (
    <>
      <Helmet>
        <title>Book Bank / 내역</title>
      </Helmet>
      <Section>{children}</Section>
    </>
  );
};

export default template;

const Section = styled.section`
  display: flex;
  height: calc(100vh - 100px);
  justify-content: space-between;
  gap: 20px;
  position: relative;
`;
