import React, { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { signOut } from "firebase/auth";
import { auth } from "@/share/firebase";

const Navigation = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const onSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
      alert("로그아웃 실패했습니다.");
    }
  };

  return (
    <NavContainer>
      <Nav>
        <div>
          <NavTitle href="/">BOOK BANK</NavTitle>
          <MenuButton onClick={() => setOpenMenu((prev) => !prev)}>
            메뉴
          </MenuButton>
        </div>
        <NavItemContainer openMenu={openMenu}>
          <NavItem href="/banking">입금 내역</NavItem>
          <NavItem href="/banking/deposit">입금하기</NavItem>
          <NavItem href="/login" onClick={onSignOut}>
            로그아웃
          </NavItem>
        </NavItemContainer>
      </Nav>
    </NavContainer>
  );
};

export default Navigation;

const NavTitle = styled(Link)`
  padding: 12px;
  font-weight: 700;
`;

const NavContainer = styled.div`
  width: calc(min(22%, 150px));
  @media (max-width: 600px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
  }
`;

const MenuButton = styled.button`
  height: 100%;
  background-color: transparent;
  padding: 12px;
  border: 1px solid lightgray;
  @media (min-width: 600px) {
    display: none;
  }
`;

const Nav = styled.nav`
  background-color: var(--main-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 600px) {
    padding: 0;
    height: 6vh;
  }
  > a:first-of-type {
    font-weight: 800;
  }
  & button {
    align-self: flex-start;
  }
  > div:first-of-type {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    @media (max-width: 600px) {
      flex-direction: row;
    }
  }
`;

const NavItemContainer = styled.div<{ openMenu: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  @media (max-width: 600px) {
    display: ${(props) => (props.openMenu ? "flex" : "none")};
    background-color: var(--bg-color);
    border: 2px solid var(--main-color);
    margin: 0;
    padding: 8px;
  }
`;

const NavItem = styled(Link)`
  text-decoration: none;
  color: var(--text-color);
  padding: 4px;
  cursor: pointer;
`;
