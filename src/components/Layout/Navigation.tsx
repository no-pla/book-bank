import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { signOut } from "firebase/auth";
import { auth } from "@/share/firebase";

const Navigation = () => {
  const onSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
      alert("로그아웃 실패했습니다.");
    }
  };
  return (
    <Nav>
      <NavItem href="/">BOOK BANK</NavItem>
      <NavItemContainer>
        <NavItem href="/banking">입금 내역</NavItem>
        <NavItem href="/banking/deposit">입금하기</NavItem>
        <NavItem href="/login" onClick={onSignOut}>
          로그아웃
        </NavItem>
      </NavItemContainer>
    </Nav>
  );
};

export default Navigation;

const Nav = styled.nav`
  background-color: var(--main-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  box-sizing: border-box;
  > a:first-of-type {
    font-weight: 800;
  }
`;

const NavItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled(Link)`
  text-decoration: none;
  color: var(--text-color);
`;
