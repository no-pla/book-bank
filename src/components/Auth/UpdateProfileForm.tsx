import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { v4 as uuid_v4 } from "uuid";
import Image from "next/image";
import { Input } from "../Custom/AuthInput";
import { storage } from "@/share/firebase";
import useModal from "../Hooks/useModal";
import useAuth from "../Hooks/useAuth";

const UpdateProfileForm = () => {
  const router = useRouter();
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
  const [imageURL, setImageURL] = useState<any>(null);
  const [selectImage, setSelectImage] = useState<any>(null);
  const UpdateNicknameInputRef = useRef<HTMLInputElement>(null);
  const UpdateNicknameInput = () => {
    return (
      <Input
        ref={UpdateNicknameInputRef}
        defaultValue={currentUser?.displayName}
        placeholder="닉네임"
      />
    );
  };

  const onUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = UpdateNicknameInputRef.current?.value;
    if (UpdateNicknameInputRef.current?.value === "") return;
    try {
      const storageRef = ref(storage, uuid_v4());
      const snapshot = await uploadBytes(storageRef, selectImage);
      const photoURL = await getDownloadURL(snapshot.ref);

      await updateProfile(currentUser, {
        displayName: username ? username : currentUser?.displayName,
        photoURL: selectImage ? photoURL : currentUser?.photoURL,
      });
      router.push("/");
    } catch (error) {
      alert("프로필 수정 중에 오류가 발생했습니다.");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectImage) return;
    const objectUrl = window.URL.createObjectURL(selectImage);
    setImageURL(objectUrl);
    return () => window.URL.revokeObjectURL(selectImage);
  }, [selectImage]);

  return (
    <ProfileContainer>
      <Title>프로필 변경</Title>
      {isShowing ? (
        <Profile>
          <Image
            id="preview-image"
            src={imageURL ? imageURL : currentUser?.photoURL} // 임시값
            height={100}
            width={100}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            alt={`${currentUser?.displayName} 님의 프로필 사진입니다.`}
          />
          <form onSubmit={(event) => onUpdateProfile(event)}>
            <UpdateNicknameInput />
            <FileInput
              type="file"
              accept="image/*"
              name="preview-image"
              onChange={(event: any) => {
                setSelectImage(event.target.files[0]);
              }}
            />
            <ButtonContainer>
              <Button type="button" onClick={toggle}>
                취소
              </Button>
              <Button type="submit">수정하기</Button>
            </ButtonContainer>
          </form>
        </Profile>
      ) : (
        <Profile>
          <div>
            <Image
              src={currentUser?.photoURL}
              height={100}
              width={100}
              alt={`${currentUser?.displayName} 님의 프로필 사진입니다.`}
              style={{ borderRadius: "50%" }}
            />
          </div>
          <div>
            <h1>{currentUser?.displayName}</h1>
            <Button onClick={toggle}>닉네임 변경하기</Button>
          </div>
        </Profile>
      )}
    </ProfileContainer>
  );
};
export default UpdateProfileForm;

const Title = styled.h2`
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const ProfileContainer = styled.section`
  padding: 20px;
  border-bottom: 1px solid lightgray;
`;

const Profile = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  & button {
    cursor: pointer;
  }
  & button:first-of-type {
    border: 1px solid var(--point-color1);
    color: var(--point-color1);
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: white;
  border-radius: 8px;
`;

const FileInput = styled.input`
  &::file-selector-button {
    padding: 8px 16px;
    background-color: white;
    border-radius: 8px;
    border: 1px solid lightgray;
    margin-top: 8px;
    margin-right: 8px;
    cursor: pointer;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 12px;

  & button:first-of-type {
    border: 1px solid var(--point-color2);
    color: var(--point-color2);
    margin-right: 4px;
  }
  & button:nth-of-type(2) {
    border: 1px solid var(--point-color1);
    color: var(--point-color1);
  }
`;
