import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { v4 as uuid_v4 } from "uuid";
import Image from "next/image";
import CustomButton from "../Custom/CustomButton";
import { storage } from "@/share/firebase";
import useModal from "../Hooks/useModal";
import useAuth from "../Hooks/useAuth";
import ErrorModal from "../Custom/ErrorModal";

const UpdateProfileForm = () => {
  const router = useRouter();
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
  const [openProfile, setOpenProfile] = useState<boolean>(false);
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
      console.log(error);
      toggle();
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
      {isShowing && (
        <ErrorModal
          title="오류가 발생했습니다."
          content="프로필 수정 중에 오류가 발생했습니다. 다시 시도해 주세요"
          toggle={() => toggle}
        />
      )}
      {openProfile ? (
        <Profile>
          <Form onSubmit={(event) => onUpdateProfile(event)}>
            <div>
              <Image
                id="preview-image"
                src={imageURL ? imageURL : currentUser?.photoURL}
                height={100}
                width={100}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                alt={`${currentUser?.displayName} 님의 프로필 사진입니다.`}
              />
              <FileInput
                type="file"
                accept="image/*"
                name="preview-image"
                onChange={(event: any) => {
                  setSelectImage(event.target.files[0]);
                }}
              />
            </div>
            <div>
              <UpdateNicknameInput />
              <ButtonContainer>
                <CustomButton
                  value="취소"
                  type="button"
                  onClick={() => setOpenProfile((prev) => !prev)}
                />
                <CustomButton type="submit" value="수정하기" />
              </ButtonContainer>
            </div>
          </Form>
        </Profile>
      ) : (
        <Profile>
          <div>
            <Image
              src={
                currentUser?.photoURL ||
                "https://firebasestorage.googleapis.com/v0/b/bookbank-e46c2.appspot.com/o/34AD2.jpg?alt=media&token=0c4ebb6c-cc17-40be-bdfb-aba945649039"
              }
              height={100}
              width={100}
              alt={`${currentUser?.displayName} 님의 프로필 사진입니다.`}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <div>
            <h1>{currentUser?.displayName}</h1>
            <CustomButton
              onClick={() => setOpenProfile((prev) => !prev)}
              value="닉네임 변경하기"
            />
          </div>
        </Profile>
      )}
    </ProfileContainer>
  );
};
export default UpdateProfileForm;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  color: var(--text-color);
  box-sizing: border-box;
  width: 144px;
`;

export const Title = styled.h2`
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
  gap: 2 0px;
  align-items: center;
  gap: 12px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  > div:first-of-type {
    display: flex;
    flex-direction: column;
  }
`;
