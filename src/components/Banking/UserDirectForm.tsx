import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../Custom/Input";
import Image from "next/image";
import { NO_IMAGE } from "@/share/server";
import { FileInput } from "../Auth/UpdateProfileForm";
import styled from "@emotion/styled";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid_v4 } from "uuid";
import { storage } from "@/share/firebase";
import { useRouter } from "next/router";
import useAuth from "../Hooks/useAuth";
import { useAddBook } from "../Hooks/useBanking";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { userDirectFormState } from "@/share/atom";
import CustomButton from "../Custom/CustomButton";
import { ButtonContainer } from "./ReviewForm";

const UserDirectForm = () => {
  const router = useRouter();
  const userDirectFormData = useSetRecoilState(userDirectFormState);
  const currentUser = useAuth();
  const [selectImage, setSelectImage] = useState<any>(null);
  const { mutate: addNewBookReview } = useAddBook();
  const [imageURL, setImageURL] = useState<any>(null);
  const methods = useForm<any>({
    defaultValues: {},
  });

  useEffect(() => {
    if (!selectImage) return;
    const objectUrl = window.URL.createObjectURL(selectImage);
    setImageURL(objectUrl);
    console.log(imageURL);
    return () => window.URL.revokeObjectURL(selectImage);
  }, [selectImage]);

  const onSubmit = async ({
    authors,
    price,
    publisher,
    title,
    review,
  }: any) => {
    const storageRef = ref(storage, uuid_v4());
    const snapshot = await uploadBytes(storageRef, selectImage);
    const photoURL = await getDownloadURL(snapshot.ref);
    const newBookReview = {
      title: title,
      publisher: publisher,
      price: Number(price) || 0,
      id: uuid_v4(),
      authors: authors.split(",").map((author: string) => author.trim()),
      review: review,
      uid: currentUser.uid,
      createdAt: Date.now(),
      createdYear: new Date().getFullYear(),
      createdMonth: new Date().getMonth() + 1,
      createdDay: new Date().getDate(),
      thumbnail: photoURL || NO_IMAGE,
    };
    try {
      await addNewBookReview(newBookReview);
    } catch (error) {
      console.log(error);
    }
    router.push("/banking");
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit((data) => onSubmit(data))}>
          <Image
            id="preview-image"
            src={imageURL ? imageURL : NO_IMAGE}
            height={100}
            width={100}
            style={{ objectFit: "cover" }}
            alt={"책표지 프리뷰입니다"}
          />
          <FileInput
            type="file"
            accept="image/*"
            name="preview-image"
            onChange={(event: any) => {
              setSelectImage(event.target.files[0]);
            }}
          />
          <Input
            validation={{
              required: {
                value: true,
                message: "필수 입력 값입니다.",
              },
            }}
            placeholder="책 제목"
            type="text"
            name="title"
          />
          <Input
            validation={{
              required: {
                value: true,
                message: "필수 입력 값입니다.",
              },
            }}
            placeholder="작가"
            type="text"
            name="authors"
          />
          <Input
            validation={{
              required: {
                value: true,
                message: "필수 입력 값입니다.",
              },
            }}
            placeholder="출판사"
            type="text"
            name="publisher"
          />
          <Input
            validation={{
              required: {
                value: true,
                message: "필수 입력 값입니다.",
              },
            }}
            placeholder="가격"
            type="text"
            name="price"
          />
          <TextArea {...methods.register("review")} />
          <ButtonContainer>
            <CustomButton type="submit" value="기록하기" />
            <CustomButton
              onClick={() => userDirectFormData(false)}
              value="닫기"
            />
          </ButtonContainer>
        </Form>
      </FormProvider>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

const TextArea = styled.textarea`
  border: none;
  resize: none;
  border-radius: 4px;
  height: 100%;
  padding: 12px;
  width: 100%;
  margin: 20px 0;
  box-sizing: border-box;
`;

export default UserDirectForm;
