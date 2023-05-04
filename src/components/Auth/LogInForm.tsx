import { auth } from "@/share/firebase";
import { emailRegex, passwordRegex } from "@/share/utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

interface ILoginData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
      if (code === "auth/wrong-password" || code === "auth/user-not-found") {
        // 비밀번호나 이메일 가입 여부를 세세하게 알려주면 해킹의 위험성 증대
        alert("이메일 혹은 비밀번호가 올바르지 않습니다."); // 추후 모달로 수정 예정
        return;
      } else {
        alert("예기치 못한 에러가 발생했습니다."); // 추후 모달로 수정 예정
      }
    }
  };

  return (
    <form onSubmit={handleSubmit((data) => onLogIn(data))}>
      <input
        {...register("email", {
          pattern: {
            value: emailRegex,
            message: "올바른 형식의 이메일이 아닙니다.",
          },
          required: {
            value: true,
            message: "필수 입력 값입니다.",
          },
        })}
        placeholder="이메일"
      />
      <p>
        {errors.email?.type === "pattern" && errors.email.message?.toString()}
        {errors.email?.type === "required" && errors.email.message?.toString()}
      </p>
      <input
        {...register("password", {
          pattern: {
            value: passwordRegex,
            message:
              "비밀번호는 알파벳 대소문자, 숫자, 특수문자(!@#$%^*+=-)를 모두 포함하고, 길이는 8자 이상 25자 이하여야 합니다.",
          },
          required: {
            value: true,
            message: "필수 입력 값입니다.",
          },
        })}
        placeholder="비밀번호"
      />
      <p>
        {errors.password?.type === "pattern" &&
          errors.password.message?.toString()}
        {errors.password?.type === "required" &&
          errors.password.message?.toString()}
      </p>
      <button>로그인</button>
    </form>
  );
};

export default LoginForm;
