import styled from "@emotion/styled";
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "@/share/firebase";
import { signOut } from "firebase/auth";
import useModal from "../Hooks/useModal";
import { GiHamburgerMenu, GiOpenBook } from "react-icons/gi";

const Navigation = () => {
  const { isShowing, toggle } = useModal();
  const [toggleMenu, setToggleMenu] = useState(false);
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
        <Link href="/">
          <GiOpenBook />
          <div>Book Bank</div>
        </Link>
      </HomeButton>
      <ToggleMenuButton>
        <GiHamburgerMenu onClick={() => setToggleMenu((prev) => !prev)} />
      </ToggleMenuButton>
      <MenuList toggleMenu={toggleMenu}>
        <Link href="/banking">내역</Link>
        <Link href="/banking/deposit">입금</Link>
        <Link href="/user/setting">설정</Link>
        <button onClick={onSignOut}>로그아웃</button>
      </MenuList>
    </Header>
  );
};

export default React.memo(Navigation);

const Header = styled.header`
  background-color: var(--main-color);
  position: fixed;
  top: 0;
  left: 0;
  width: calc(min(100%, 1960px));
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
  font-size: 1.3rem;
  z-index: 100;
  box-shadow: -1px 6px 7px 3px rgba(209, 198, 198, 0.62);
  -webkit-box-shadow: -1px 6px 7px 3px rgba(209, 198, 198, 0.62);
  -moz-box-shadow: -1px 6px 7px 3px rgba(209, 198, 198, 0.62);
  @media (max-width: 380px) {
    padding: 0 20px;
  }
`;

const HomeButton = styled.div`
  > a {
    font-size: 1.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

const MenuList = styled.div<{ toggleMenu: boolean }>`
  display: flex;
  gap: 12px;
  align-items: center;
  > button {
    text-align: center;
    font-size: 1.3rem;
    font-weight: 100;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  @media (max-width: 380px) {
    position: absolute;
    top: 0;
    right: 0;
    height: calc(100% - 60px);
    background-color: var(--sub-main-color);
    border-left: 2px solid var(--main-color);
    display: ${(props) => (props.toggleMenu ? "flex" : "none")};
    position: fixed;
    flex-direction: column;
    top: 60px;
    right: 0;
    width: 40%;
    align-items: flex-end;
    padding: 20px 24px;
    gap: 20px;
  }
`;

const ToggleMenuButton = styled.button`
  display: none;
  background-color: transparent;
  color: whitesmoke;
  border: none;
  padding: 0;
  height: fit-content;
  @media (max-width: 380px) {
    display: block;
    height: 17px;
  }
`;
