import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { v4 as uuid_v4 } from "uuid";
import styled from "@emotion/styled";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/share/firebase";
import useAuth from "../Hooks/useAuth";
import useModal from "../Hooks/useModal";
import ErrorModal from "../Custom/ErrorModal";
import CustomButton from "../Custom/CustomButton";
import useDisabled from "../Hooks/useDisabled";
import Input from "../Custom/Input";
import { FormProvider, useForm } from "react-hook-form";

export const UpdateProfileForm = () => {
  const router = useRouter();
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
  const { isDisabled, toggleDisabled } = useDisabled();
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<any>(null);
  const [selectImage, setSelectImage] = useState<any>(null);
  const UpdateNicknameInputRef = useRef<HTMLInputElement>(null);
  const preview =
    currentUser?.photoURL ||
    "https://firebasestorage.googleapis.com/v0/b/bookbank-e46c2.appspot.com/o/34AD2.jpg?alt=media&token=0c4ebb6c-cc17-40be-bdfb-aba945649039";

  const methods = useForm({
    defaultValues: {
      newNickname:
        currentUser?.displayName || UpdateNicknameInputRef.current?.value,
    },
  });

  const onUpdateProfile = async ({ newDisplayName }: any) => {
    toggleDisabled();

    try {
      const storageRef = ref(storage, uuid_v4());
      const snapshot = await uploadBytes(storageRef, selectImage);
      const photoURL = await getDownloadURL(snapshot.ref);

      await updateProfile(currentUser, {
        displayName: newDisplayName ? newDisplayName : currentUser?.displayName,
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
          toggle={toggle}
        />
      )}
      {openProfile ? (
        <Profile>
          <FormProvider {...methods}>
            <Form
              onSubmit={methods.handleSubmit((data) => {
                onUpdateProfile(data);
              })}
            >
              <div>
                <Image
                  id="preview-image"
                  src={imageURL ? imageURL : preview}
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
                <Input
                  validation={{
                    required: {
                      value: true,
                      message: "필수 입력값입니다.",
                    },
                    maxLength: {
                      value: 10,
                      message: "최대 10자까지 입력 가능합니다,",
                    },
                  }}
                  placeholder="새로운 닉네임"
                  type="text"
                  name="newDisplayName"
                />
                <ButtonContainer>
                  <CustomButton
                    value="취소"
                    type="button"
                    onClick={() => setOpenProfile((prev) => !prev)}
                    disabled={isDisabled}
                  />
                  <CustomButton
                    type="submit"
                    value="수정하기"
                    disabled={isDisabled}
                  />
                </ButtonContainer>
              </div>
            </Form>
          </FormProvider>
        </Profile>
      ) : (
        <Profile>
          <div>
            <Image
              src={preview}
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

// const Input = styled.input`
//   padding: 8px;
//   border-radius: 4px;
//   border: 1px solid lightgray;
//   color: var(--text-color);
//   box-sizing: border-box;
//   font-size: 1.1rem;
//   font-weight: 200;
//   width: 144px;
// `;

export const Title = styled.h2`
  font-weight: 700;
  font-size: 1.4em;
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
    font-size: 1.1rem;
  }
  & button:first-of-type {
    border: 1px solid var(--point-color2);
    color: var(--point-color2);
  }
  & button:last-of-type {
    border: 1px solid var(--point-color1);
    color: var(--point-color1);
  }
  @media (max-width: 280px) {
    img {
      width: 80px;
      height: 80px;
    }
  }
`;

export const FileInput = styled.input`
  &::file-selector-button {
    padding: 8px 16px;
    background-color: whitesmoke;
    border-radius: 8px;
    border: 1px solid lightgray;
    margin-top: 8px;
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
