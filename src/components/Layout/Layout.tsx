import React from "react";
import Header from "./Header";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

const Layout = ({ children }: any) => {
  const router = useRouter();
  return (
    <LayoutContainer>
      {router.pathname !== "/login" && router.pathname !== "/register" && (
        <Header />
      )}
      <>{children}</>
    </LayoutContainer>
  );
};

export default Layout;

const LayoutContainer = styled.div`
  display: flex;
  > header {
    width: 10%;
  }
`;
