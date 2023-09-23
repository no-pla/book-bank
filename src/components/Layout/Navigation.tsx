import styled from "@emotion/styled";
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "@/share/firebase";
import { signOut } from "firebase/auth";
import useModal from "../Hooks/useModal";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import ErrorModal from "../Custom/ErrorModal";

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
      {isShowing && (
        <ErrorModal
          title="로그아웃을 실패했습니다."
          content="인터넷을 연결해 주세요."
          toggle={toggle}
        />
      )}
      <HomeButton>
        <Link href="/" aria-label="메인 페이지로 이동">
          Book Bank
        </Link>
      </HomeButton>
      <MenuButton
        aria-label="메뉴 버튼"
        onClick={() => setOpenMenu((prev) => !prev)}
      >
        <RxHamburgerMenu size={20} />
      </MenuButton>
      <MenuList menubar={openMenu}>
        <MenuCloseButton
          onClick={() => setOpenMenu((prev) => !prev)}
          aria-label="메뉴 버튼"
        >
          <RxCross1 size={20} />
        </MenuCloseButton>
        <MenuLink href="/banking">내역</MenuLink>
        <MenuLink href="/banking/deposit">입금</MenuLink>
        <MenuLink href="/user/setting">설정</MenuLink>
        <LogoutButton onClick={onSignOut}>로그아웃</LogoutButton>
      </MenuList>
    </Header>
  );
};

export default React.memo(Navigation);

const Header = styled.header`
  background-color: #8067a9;
  position: fixed;
  top: 0;
  z-index: 1;
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
  @media (max-width: 600px) {
    padding-right: 0;
  }
`;

const HomeButton = styled.div`
  > a {
    color: white;
    font-size: 1.2rem;
  }
`;

const MenuButton = styled.button`
  color: white;
  background-color: transparent;
  padding: 12px 20px;
  border: none;
  text-align: right;
  display: none;
  @media (max-width: 600px) {
    display: block;
  }
`;

const MenuList = styled.div<{ menubar: boolean }>`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 12px;
  @media (max-width: 600px) {
    background-color: #5c4a84;
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    width: 60vw;
    align-items: flex-end;
    flex-direction: column;
    padding: 0 20px;
    box-sizing: border-box;
    display: ${(props) => (props.menubar ? "flex" : "none")};
    > * {
      color: white;
    }
  }
`;

const MenuCloseButton = styled.button`
  width: fit-content;
  color: white;
  padding: 12px 8px 0 0;
  border: none;
  background-color: transparent;
  display: none;
  @media (max-width: 600px) {
    display: block;
  }
`;

const MenuLink = styled(Link)`
  color: white;
  padding: 12px 0px;
  text-align: left;
  @media (max-width: 600px) {
    border-bottom: 0.7px solid white;
    width: 100%;
  }
`;

const LogoutButton = styled.button`
  text-align: left;
  color: white;
  background-color: transparent;
  border: none;
  font-size: 0.9rem;
  @media (max-width: 600px) {
    padding: 12px 0;
    width: 100%;
    border-bottom: 0.7px solid white;
  }
`;
