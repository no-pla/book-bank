import React from "react";
import styled from "@emotion/styled";
import Navigation from "./Navigation";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();

  return (
    <>
      {router.pathname !== "/login" && router.pathname !== "/register" ? (
        // 로그인이나 회원가입 페이지가 아닐 때면 헤더 show
        <LayoutContainer>
          <Navigation />
          <main>{children}</main>
        </LayoutContainer>
      ) : (
        <main>{children}</main>
      )}
    </>
  );
};

export default Layout;

const LayoutContainer = styled.div`
  max-width: 1960px;
  margin: 60px auto 40px;
  > main {
    padding: 20px 24px 0;
    height: calc(100vh - 120px);
  }
`;
