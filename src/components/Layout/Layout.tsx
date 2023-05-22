import React from "react";
import styled from "@emotion/styled";
import Navigation from "./Navigation";
import { useRouter } from "next/router";

const Layout = ({ children }: any) => {
  const router = useRouter();

  return (
    <>
      {router.pathname !== "/login" && router.pathname !== "/register" ? (
        <LayoutContainer>
          <Navigation />
          <div>{children}</div>
        </LayoutContainer>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
};

export default Layout;

const LayoutContainer = styled.div`
  max-width: 1960px;
  margin: 60px auto 40px;
  > div {
    padding: 20px 24px 0;
    height: calc(100vh - 120px);
  }
`;
