import React from "react";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/share/firebase";
import { DB_LINK } from "@/share/server";
import { emailRegex, passwordRegex } from "@/share/utils";
import {
  Button,
  Container,
  Description,
  Form,
  FormContainer,
  Icon,
  Title,
  TitleContainer,
  ToggleLink,
} from "./LogInForm";
import AuthInput from "../Custom/AuthInput";

interface IUserData {
  email: string;
  password: string;
  username: string;
}

const SignUpForm = () => {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
      password_confirm: "",
      username: "",
    },
  });

  const onSubmit = async ({ email, password, username }: IUserData) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (userCredential) => {
          // 입력값 DB에 저장
          const user = userCredential.user;
          await updateProfile(user, {
            displayName: username,
          }).then(async () => {
            await axios.post(`${DB_LINK}/users`, {
              id: user.uid,
              nickname: user.displayName,
              email: user.email,
              signUpDate: new Date().toLocaleDateString(),
            });
          });
        }
      );
    } catch ({ code }: any) {
      if (code === "auth/email-already-in-use") {
        alert("이미 가입된 계정입니다."); // 추후 모달로 수정
        return;
      } else {
        alert("예기치 못한 오류로 회원가입을 실패했습니다."); // 추후 모달로 수정
        return;
      }
    }
  };

  return (
    <Container>
      <FormContainer>
        <TitleContainer>
          <Description>당신의 독서를 저금하세요.</Description>
          <Title>북 뱅크</Title>
          <Icon>📚</Icon>
        </TitleContainer>
        <FormProvider {...methods}>
          <Form onSubmit={methods.handleSubmit((data) => onSubmit(data))}>
            <AuthInput
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
            <AuthInput
              validation={{
                pattern: {
                  value: passwordRegex,
                  message:
                    "비밀번호는 알파벳 대소문자, 숫자, 특수문자(!@#$%^*+=-)를 모두 포함하고, 길이는 8자 이상 25자 이하여야 합니다.",
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
            <AuthInput
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
            <AuthInput
              validation={{
                minLength: {
                  value: 2,
                  message: "닉네임은 2글자 이상 10글자 이하로 설정해 주세요.",
                },
                maxLength: {
                  value: 10,
                  message: "닉네임은 2글자 이상 10글자 이하로 설정해 주세요.",
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
          </Form>
        </FormProvider>
        <ToggleLink href="/login">로그인하기</ToggleLink>
      </FormContainer>
    </Container>
  );
};

export default SignUpForm;
