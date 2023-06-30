import React, { useState } from "react";
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
import ErrorModal from "../Custom/ErrorModal";
import useModal from "../Hooks/useModal";
import { FcGoogle } from "react-icons/fc";
interface ILoginData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { isShowing, toggle } = useModal();
  const [errorMessage, setErrorMessage] = useState<string[]>(["", ""]);
  const provider = new GoogleAuthProvider();
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onLogIn = async ({ email, password }: ILoginData) => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        router.push("/");
      });
    } catch ({ code }: any) {
      if (code === "auth/wrong-password" || code === "auth/user-not-found") {
        setErrorMessage([
          "다시 시도해 주세요.",
          "이메일 혹은 비밀번호가 올바르지 않습니다.",
        ]);
        // 비밀번호나 이메일 가입 여부를 세세하게 알려주면 해킹의 위험성 증대
      } else {
        setErrorMessage([
          "다시 시도해 주세요.",
          "예기치 못한 에러가 발생했습니다.",
        ]);
      }
      toggle();
    }
  };

  const googleLogin = async () => {
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) return;
        const user = result.user;
        await axios.post(`${DB_LINK}/users`, {
          id: user.uid,
          nickname: user.displayName,
          email: user.email,
          signUpDate: new Date().toLocaleDateString(),
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        setErrorMessage([
          "다시 시도해 주세요.",
          "예기치 못한 에러가 발생했습니다.",
        ]);
        toggle();
      });
  };

  return (
    <Container>
      {isShowing && (
        <ErrorModal
          title={errorMessage[0]}
          content={errorMessage[1]}
          toggle={toggle}
        />
      )}
      <FormContainer>
        <FormProvider {...methods}>
          {/* 중첩된 컴포넌트에서 useForm을 사용하기 위하여 FormProvider와 useFormContext를 사용 */}
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
                    "비밀번호는 최소 6자 이상, 숫자와 영문자를 모두 포함해야 합니다.",
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
            <Button type="submit">로그인</Button>
            <ToggleLink href="/register">이메일로 시작하기</ToggleLink>
          </Form>
        </FormProvider>
        <Line>&nbsp;&nbsp;또는&nbsp;&nbsp;</Line>
        <div>
          <button onClick={() => googleLogin()}>
            <FcGoogle size={24} />
          </button>
        </div>
      </FormContainer>
    </Container>
  );
};

export default LoginForm;

const Line = styled.div`
  padding: 12px 0;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  &::before {
    content: "";
    background-color: #c0c0c0;
    flex-grow: 1;
    height: 1px;
    font-size: 0;
    line-height: 0;
  }
  &::after {
    content: "";
    background-color: #c0c0c0;
    flex-grow: 1;
    height: 1px;
    font-size: 0;
    line-height: 0;
  }
`;

export const ToggleLink = styled(Link)`
  text-decoration: none;
  display: inline-flex;
  padding-top: 16px;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  width: 100%;
`;

export const Container = styled.div``;

export const FormContainer = styled.div`
  > div:last-of-type {
    text-align: center;
  }
  > div:last-of-type > button {
    border: 2px solid #db4437;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
`;

export const Form = styled.form``;

export const Button = styled.button`
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid lightgray;
  margin-top: 12px;
`;

export const TitleContainer = styled.div``;
