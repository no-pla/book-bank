import styled from "@emotion/styled";
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "@/share/firebase";
import { signOut } from "firebase/auth";
import useModal from "../Hooks/useModal";

const Navigation = () => {
  const { isShowing, toggle } = useModal();
  const [openMenu, setOpenMenu] = useState(false);

  const onSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
      toggle();
    }
  };
  return (
    <Header>
      <HomeButton>
        <Link href="/">Book Bank</Link>
      </HomeButton>
      {/* <MenuList>
        <Link href="/banking">내역</Link>
        <Link href="/banking/deposit">입금</Link>
        <Link href="/user/setting">설정</Link>
        <button onClick={onSignOut}>로그아웃</button>
      </MenuList> */}
    </Header>
  );
};

export default Navigation;

const Header = styled.header`
  background-color: #8067a9;
  position: fixed;
  top: 0;
  width: calc(min(100%, 1960px));
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  box-shadow: -1px 6px 7px 3px rgba(209, 198, 198, 0.62);
  -webkit-box-shadow: -1px 6px 7px 3px rgba(209, 198, 198, 0.62);
  -moz-box-shadow: -1px 6px 7px 3px rgba(209, 198, 198, 0.62);
`;

const HomeButton = styled.div`
  > a {
    font-size: 1.2rem;
  }
`;

const MenuList = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 1rem;
  > button {
    text-align: center;
    font-size: 0.9rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
`;
