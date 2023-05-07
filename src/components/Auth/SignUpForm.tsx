import React from "react";
import { useForm } from "react-hook-form";
import { emailRegex, passwordRegex } from "@/share/utils";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/share/firebase";
import axios from "axios";
import { DB_LINK } from "@/share/server";

interface IUserData {
  email: string;
  password: string;
  username: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
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
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
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
        {(errors.email?.type === "required" && errors.email.message) ||
          (errors.email?.type === "pattern" && errors.email.message)}
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
        {(errors.password?.type === "required" && errors.password.message) ||
          (errors.password?.type === "pattern" && errors.password.message)}
      </p>
      <input
        {...register("password_confirm", {
          validate: (value) =>
            value === watch("password") || "비밀번호가 일치하지 않습니다.",
          required: {
            value: true,
            message: "필수 입력 값입니다.",
          },
        })}
        placeholder="비밀번호 확인"
      />
      <p>
        {(errors.password_confirm?.type === "required" &&
          errors.password_confirm.message) ||
          (errors.password_confirm?.type === "validate" &&
            errors.password_confirm.message?.toString())}
      </p>
      <input
        {...register("username", {
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
        })}
        placeholder="닉네임"
      />
      <p>
        {(errors.username?.type === "required" && errors.username.message) ||
          (errors.username?.type === "maxLength" && errors.username.message) ||
          (errors.username?.type === "minLength" && errors.username.message)}
      </p>
      <button>회원가입</button>
    </form>
  );
};

export default SignUpForm;
