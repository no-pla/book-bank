import React, { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/share/firebase";
import { emailRegex, passwordRegex } from "@/share/utils";
import useModal from "../Hooks/useModal";
import Input from "../Custom/Input";
import dynamic from "next/dynamic";
import useAuth from "../Hooks/useAuth";

const ErrorModal = dynamic(() => import("../Custom/ErrorModal"), {
  ssr: false,
});

interface ILoginData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
  const [errorMessage, setErrorMessage] = useState<string[]>(["", ""]);
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
          {/* 중첩된 컴포넌트에서 useForm을 사용하기 위하여 FormProvider와 useFormContext를 사용 */}
          <form onSubmit={methods.handleSubmit((data) => onLogIn(data))}>
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
          </form>
        </FormProvider>
      </FormContainer>
    </>
  );
};

export default LoginForm;

export const ToggleLink = styled(Link)`
  text-decoration: none;
  display: inline-flex;
  padding: 12px 0;
  margin-top: 16px;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  width: 100%;
`;

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

export const Button = styled.button`
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid lightgray;
  margin-top: 12px;
`;
