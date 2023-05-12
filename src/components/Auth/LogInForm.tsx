import React from "react";
import axios from "axios";
import Link from "next/link";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FormProvider, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/share/firebase";
import { DB_LINK } from "@/share/server";
import AuthInput from "../Custom/AuthInput";
import { emailRegex, passwordRegex } from "@/share/utils";
import CustomButton from "../Custom/CustomButton";

interface ILoginData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogIn = async ({ email, password }: ILoginData) => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        router.push("/");
      });
    } catch ({ code }: any) {
      console.log(code);
      if (code === "auth/wrong-password" || code === "auth/user-not-found") {
        // 비밀번호나 이메일 가입 여부를 세세하게 알려주면 해킹의 위험성 증대
        alert("이메일 혹은 비밀번호가 올바르지 않습니다."); // 추후 모달로 수정 예정
      } else {
        alert("예기치 못한 에러가 발생했습니다."); // 추후 모달로 수정 예정
      }
    }
  };

  const googleLogin = async () => {
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) return;
        const token = credential.accessToken;
        const user = result.user;
        console.log(token, user);
        await axios.post(`${DB_LINK}/users`, {
          id: user.uid,
          nickname: user.displayName,
          email: user.email,
          signUpDate: new Date().toLocaleDateString(),
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
        // ...
      });
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
          <Form onSubmit={methods.handleSubmit((data) => onLogIn(data))}>
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
            <Button>로그인</Button>
          </Form>
        </FormProvider>
        <ToggleLink href="/register">회원가입</ToggleLink>
        <div>
          <CustomButton value="구글로 로그인" onClick={() => googleLogin()} />
        </div>
      </FormContainer>
    </Container>
  );
};

export default LoginForm;

export const ToggleLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  margin: 20px 0;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 62px;
  width: 100%;
  color: var(--text-color);
  height: 100vh;
`;

export const Icon = styled.div`
  font-size: 4rem;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(60%, 600px);
  background-color: rgba(255, 255, 255, 0.3);
  padding: 40px;
  border-radius: 8px;
  > div:last-of-type > button {
    color: #db4437;
    border: 2px solid #db4437;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 4px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid lightgray;
  cursor: pointer;
`;

export const TitleContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 60px;
`;

export const Description = styled.p`
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;
