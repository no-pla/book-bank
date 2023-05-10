import React from "react";
import styled from "@emotion/styled";
import Navigation from "./Navigation";
import { useRouter } from "next/router";

const Layout = ({ children }: any) => {
  const router = useRouter();
  return (
    <LayoutContainer>
      {router.pathname !== "/login" && router.pathname !== "/register" && (
        <Navigation />
      )}
      {children}
    </LayoutContainer>
  );
};

export default Layout;

const LayoutContainer = styled.div`
  display: flex;
  > nav {
    width: 16%;
  }
  @media (max-width: 600px) {
    > nav {
      display: none;
    }
  }
`;
