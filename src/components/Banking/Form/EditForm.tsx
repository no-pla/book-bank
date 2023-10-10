import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { FormProvider, useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Resizer from "react-image-file-resizer";
import { isFormEdit, selectMyBookState } from "@/share/atom";
import { useUpdateBook } from "../../Hooks/useBanking";
import CustomButton from "../../Custom/CustomButton";
import useModal from "../../Hooks/useModal";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid_v4 } from "uuid";
import { storage } from "@/share/firebase";
import { FileInput, FileInputLabel } from "../../Auth/UpdateProfileForm";
import Input, { ErrorMessage } from "../../Custom/Input";
import dynamic from "next/dynamic";

const ConfirmModal = dynamic(() => import("../../Custom/ConfirmModal"), {
  ssr: false,
});

interface IEditData {
  authors: string;
  price: number;
  publisher: string;
  review: string;
  title: string;
}

const EditForm = () => {
  const { isShowing, toggle } = useModal();
  const [disabled, toggleDisabled] = useState<boolean>(false);
  const { mutate: updateReview } = useUpdateBook();
  const [edit, setEdit] = useRecoilState(isFormEdit);
  const targetMyBookData = useRecoilValue<any>(selectMyBookState);
  const setDetail = useSetRecoilState<any>(selectMyBookState);
  const [selectImage, setSelectImage] = useState<any>(null);
  const [imageURL, setImageURL] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const methods = useForm({
    defaultValues: {
      title: targetMyBookData?.title,
      price: targetMyBookData?.price,
      review: targetMyBookData.review,
      authors: targetMyBookData?.authors,
      publisher: targetMyBookData?.publisher,
    },
    mode: "onChange",
  });

  const onEdit = async (data: IEditData) => {
    let authors: string[] | string = data.authors;
    if (typeof data.authors === "string") {
      authors = authors.split(",").map((author: string) => author.trim());
    }
    toggleDisabled((prev) => !prev);
    try {
      const storageRef = ref(storage, uuid_v4());
      const snapshot = await uploadBytes(storageRef, selectImage);
      const thumbnail = await getDownloadURL(snapshot.ref);
      const editReview = {
        ...targetMyBookData,
        authors,
        price: Number(data.price),
        publisher: data.publisher,
        review: data?.review,
        title: data.title,
        thumbnail: selectImage ? thumbnail : targetMyBookData.thumbnail,
      };

      updateReview(editReview);
      setDetail(editReview);
      setEdit(!edit);
    } catch (error) {
      setErrorMessage([
        "예기치 못한 오류가 발생했습니다!",
        "다시 시도해 주세요.",
      ]);
      toggle();
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectImage) return;
    const objectUrl = window.URL.createObjectURL(selectImage);
    setImageURL(objectUrl);
    return () => window.URL.revokeObjectURL(selectImage);
  }, [selectImage]);

  const onClickClose = () => {
    setErrorMessage([
      "정말로 수정을 취소할까요?",
      "이 작업은 되돌릴 수 없습니다!",
    ]);
    toggle();
  };

  const resizeFile = (file: Blob) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "WEBP",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob"
      );
    });

  const onUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    try {
      const file = event.target.files[0];
      const image = await resizeFile(file);
      // blob 파일 생성
      setSelectImage(image);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isShowing && (
        <ConfirmModal
          title={errorMessage[0]}
          content={errorMessage[1]}
          toggle={toggle}
          onFunc={() => setEdit(!edit)}
        />
      )}
      <FormProvider {...methods}>
        <Form
          onSubmit={methods.handleSubmit((data) => {
            onEdit(data);
          })}
        >
          <div>
            <Image
              src={imageURL ? imageURL : targetMyBookData?.thumbnail}
              height={174}
              width={120}
              style={{ objectFit: "cover" }}
              alt={"책표지 프리뷰입니다"}
            />
            <FileInputLabel htmlFor="preview-image">파일 선택</FileInputLabel>
            <FileInput
              type="file"
              accept="image/*"
              name="preview-image"
              id="preview-image"
              onChange={(event) => onUploadPhoto(event)}
            />
          </div>
          <Input
            validation={{
              required: {
                value: true,
                message: "필수 입력값입니다.",
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
                message: "필수 입력값입니다.",
              },
            }}
            placeholder="작가"
            type="text"
            name="authors"
          >
            <Message>
              작가가 여러 명인 경우, 쉼표(,)로 구분하여 작성해 주세요.
            </Message>
          </Input>
          <Input
            validation={{
              required: {
                value: true,
                message: "필수 입력값입니다.",
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
                message: "필수 입력값입니다.",
              },
              pattern: {
                value: /^\d+$/,
                message: "금액은 쉼표 없이 숫자만 입력해 주세요",
              },
            }}
            placeholder="가격"
            type="text"
            name="price"
          />
          <TextArea
            {...methods.register("review", {
              maxLength: {
                value: 500,
                message: "최대 500자까지 입력 가능합니다,",
              },
            })}
            placeholder="리뷰를 작성해 주세요.(최대 500자)"
          />
          <ErrorMessage>
            {methods.formState.errors.review?.type === "maxLength" &&
              methods.formState.errors.review.message?.toString()}
          </ErrorMessage>
          <CustomButton value="수정" type="submit" disabled={disabled} />
          <CustomButton
            value="수정 취소"
            type="button"
            onClick={onClickClose}
            disabled={disabled}
          />
        </Form>
      </FormProvider>
    </>
  );
};

export default EditForm;

const Form = styled.form`
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  > button:first-of-type {
    color: var(--point-color1);
    border: 1px solid var(--point-color1);
    margin-bottom: 4px;
  }
  > button:last-of-type {
    color: var(--point-color2);
    border: 1px solid var(--point-color2);
  }
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  > div:first-of-type {
    margin-bottom: 12px;
  }
`;

export const TextArea = styled.textarea`
  border: none;
  resize: none;
  border-radius: 4px;
  padding: 12px;
  height: 120px;
  font-size: 0.9rem;
  font-weight: 100;
`;

export const Message = styled.p`
  font-weight: 400;
  font-size: 0.8rem;
  margin-top: 8px;
`;
