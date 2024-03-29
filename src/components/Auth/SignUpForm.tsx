import React, { useState } from "react";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/share/firebase";
import { DB_LINK } from "@/share/server";
import { emailRegex, passwordRegex } from "@/share/utils";
import { Button, FormContainer, ToggleLink } from "./LogInForm";
import useModal from "../Hooks/useModal";
import Input from "../Custom/Input";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ErrorModal = dynamic(() => import("../Custom/ErrorModal"), {
  ssr: false,
});

interface IUserData {
  email: string;
  password: string;
  username: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const { isShowing, toggle } = useModal();
  const [errorMessage, setErrorMessage] = useState<string[]>(["", ""]);
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
      password_confirm: "",
      username: "",
    },
    mode: "onChange",
  });

  const onSubmit = async ({ email, password, username }: IUserData) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (userCredential) => {
          // 입력값 DB에 저장
          const user = userCredential.user;
          await updateProfile(user, {
            displayName: username,
            photoURL:
              "https://firebasestorage.googleapis.com/v0/b/bookbank-e46c2.appspot.com/o/34AD2.jpg?alt=media&token=0c4ebb6c-cc17-40be-bdfb-aba945649039",
          })
            .then(async () => {
              await axios
                .post(`${DB_LINK}/users`, {
                  id: user.uid,
                  nickname: user.displayName,
                  email: user.email,
                  signUpDate: new Date().toLocaleDateString(),
                })
                .then(() => {
                  router.push("/");
                });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
    } catch ({ code }: any) {
      if (code === "auth/email-already-in-use") {
        setErrorMessage([
          "이미 가입된 이메일입니다.",
          "로그인 혹은 다른 이메일로 다시 시도해 주세요.",
        ]);
        toggle();
        return;
      } else {
        setErrorMessage([
          "오류가 발생했습니다.",
          "예기치 못한 오류로 회원가입을 실패했습니다.",
        ]);
        toggle();
        return;
      }
    }
  };

  return (
    <>
      {isShowing && (
        <ErrorModal
          title={errorMessage[0]}
          content={errorMessage[1]}
          toggle={toggle}
        />
      )}
      <FormContainer>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit((data) => onSubmit(data))}>
            <Input
              validation={{
                pattern: {
                  value: emailRegex,
                  message: "올바른 형식의 이메일이 아닙니다.",
                },
                required: {
                  value: true,
                  message: "필수 입력 값입니다.",
                },
              }}
              placeholder="이메일"
              type="text"
              name="email"
            />
            <Input
              validation={{
                pattern: {
                  value: passwordRegex,
                  message:
                    "비밀번호는 최소 8자 이상, 숫자와 영문자를 모두 포함해야 합니다.",
                },
                required: {
                  value: true,
                  message: "필수 입력 값입니다.",
                },
              }}
              placeholder="비밀번호"
              type="password"
              name="password"
            />
            <Input
              validation={{
                validate: (value: string) =>
                  value === methods.watch("password") ||
                  "비밀번호가 일치하지 않습니다.",
                required: {
                  value: true,
                  message: "필수 입력 값입니다.",
                },
              }}
              placeholder="비밀번호 확인"
              type="password"
              name="password_confirm"
            />
            <Input
              validation={{
                minLength: {
                  value: 2,
                  message: "닉네임은 2글자 이상 6글자 이하로 설정해 주세요.",
                },
                maxLength: {
                  value: 6,
                  message: "닉네임은 2글자 이상 6글자 이하로 설정해 주세요.",
                },
                required: {
                  value: true,
                  message: "필수 입력 값입니다.",
                },
              }}
              placeholder="닉네임"
              type="username"
              name="username"
            />
            <Button>회원가입</Button>
          </form>
        </FormProvider>
        <ToggleLink href="/login">로그인하기</ToggleLink>
      </FormContainer>
    </>
  );
};

export default SignUpForm;
