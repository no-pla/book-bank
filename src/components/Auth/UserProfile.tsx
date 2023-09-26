import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiSettings } from "react-icons/fi";
import useAuth from "../Hooks/useAuth";

const UserProfile = () => {
  const currentUser = useAuth();

  return (
    <UserInfo>
      <Image
        src={
          currentUser?.photoURL ||
          "https://firebasestorage.googleapis.com/v0/b/bookbank-e46c2.appspot.com/o/34AD2.jpg?alt=media&token=0c4ebb6c-cc17-40be-bdfb-aba945649039"
        }
        height={100}
        width={100}
        alt={`${currentUser?.displayName} 님의 프로필 사진입니다.`}
        loading="eager"
      />
      <span>{currentUser?.displayName || "로딩 중..."}</span>
      <Link href="/user/setting">
        <FiSettings style={{ paddingRight: "8px" }} />
        프로필 설정
      </Link>
    </UserInfo>
  );
};

export default UserProfile;

const UserInfo = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  > img {
    border-radius: 50%;
    margin: 20px 0;
    object-fit: cover;
  }
  > span {
    font-weight: 700;
    margin-bottom: 12px;
  }
  a {
    font-size: 0.9rem;
  }
`;
