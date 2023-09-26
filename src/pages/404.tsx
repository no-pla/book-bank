import CustomButton from "@/components/Custom/CustomButton";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";

const Custom404 = () => {
  const router = useRouter();
  return (
    <Container>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="독서 기록 남기기" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="독서, 독후감, 독서 기록, 독서기록장" />
        <title>Book Bank / 404</title>
      </Helmet>
      <Message>존재하지 않는 페이지입니다. 😥</Message>
      <CustomButton
        value="메인 화면으로"
        type="button"
        onClick={() => router.push("/")}
      />
    </Container>
  );
};

export default Custom404;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const Message = styled.h1``;
