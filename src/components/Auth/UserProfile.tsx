import { auth } from "@/share/firebase";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiSettings } from "react-icons/fi";

const UserProfile = () => {
  return (
    <UserInfo>
      <Image
        src={
          auth.currentUser?.photoURL ||
          "https://firebasestorage.googleapis.com/v0/b/bookbank-e46c2.appspot.com/o/34AD2.jpg?alt=media&token=0c4ebb6c-cc17-40be-bdfb-aba945649039"
        }
        height={100}
        width={100}
        alt={`${auth.currentUser?.displayName} 님의 프로필 사진입니다.`}
        loading="eager"
      />
      <UserName>{auth.currentUser?.displayName || "닉네임 없음"}</UserName>
      <Link href="/user/setting">
        <span>
          <FiSettings />
          프로필 설정
        </span>
      </Link>
    </UserInfo>
  );
};

export default UserProfile;

const UserInfo = styled.section`
  width: 20vw;
  background-color: var(--sub-main-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  border-radius: 12px;
  box-sizing: border-box;
  > img {
    border-radius: 50%;
    margin: 12px 0;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    order: -1;
    width: 48%;
  }
  @media (max-width: 600px) {
    width: 100%;
    padding: 20px 0;
    box-sizing: border-box;
  }
  > a > span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-weight: 100;
  }
`;

const UserName = styled.div`
  margin-bottom: 16px;
  font-weight: 800;
  font-size: 1.4rem;
`;
