import React, { useEffect, useState } from "react";
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
import { FormProvider, useForm } from "react-hook-form";
import Input from "../Custom/Input";
import dynamic from "next/dynamic";

const ErrorModal = dynamic(() => import("../Custom/ErrorModal"), {
  ssr: false,
});

const UpdateProfileForm = () => {
  const router = useRouter();
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
  const [disabled, toggleDisabled] = useState<boolean>(false);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [selectImage, setSelectImage] = useState<any>(null);
  const methods = useForm({
    defaultValues: {
      newDisplayName: currentUser?.displayname,
      newPhotoURL: currentUser?.photoURL,
    },
    mode: "onChange",
  });

  const onUpdateProfile = async ({
    newDisplayName,
  }: {
    newDisplayName: string;
  }) => {
    toggleDisabled((prev) => !prev);
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
    toggleDisabled((prev) => !prev);
  };

  const onClickCancel = () => {
    setImageURL(null);
    setOpenProfile((prev) => !prev);
    methods.reset();
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
              onSubmit={methods.handleSubmit((data) => onUpdateProfile(data))}
            >
              <div>
                <Image
                  src={imageURL ? imageURL : currentUser?.photoURL}
                  height={100}
                  width={100}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                  alt={`${currentUser?.displayName} 님의 프로필 사진입니다.`}
                />
                <FileInputLabel htmlFor="preview-image">
                  파일 선택
                </FileInputLabel>
                <FileInput
                  type="file"
                  accept="image/*"
                  name="preview-image"
                  id="preview-image"
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
                      message: "필수 입력 값입니다.",
                    },
                    maxLength: {
                      value: 10,
                      message: "닉네임은 최대 10자까지 입력해 주세요",
                    },
                  }}
                  placeholder="닉네임"
                  type="text"
                  name="newDisplayName"
                  defaultValue={currentUser?.displayName}
                />
                <ButtonContainer>
                  <CustomButton
                    value="취소"
                    type="button"
                    onClick={onClickCancel}
                    disabled={disabled}
                  />
                  <CustomButton
                    type="submit"
                    value="수정하기"
                    disabled={disabled}
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
            <h1>{currentUser?.displayName ?? "닉네임 없음"}</h1>
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

export const Title = styled.h2`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const ProfileContainer = styled.section`
  padding-bottom: 20px;
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
  & button:first-of-type {
    border: 1px solid var(--point-color1);
    color: var(--point-color1);
  }
`;

export const FileInputLabel = styled.label`
  font-size: 1rem;
  padding: 8px 16px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid lightgray;
  margin: 16px 0;
  cursor: pointer;
`;

export const FileInput = styled.input`
  display: none;
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
  gap: 8px;
  align-items: flex-start;
  > div:first-of-type {
    display: flex;
    flex-direction: column;
  }
`;
