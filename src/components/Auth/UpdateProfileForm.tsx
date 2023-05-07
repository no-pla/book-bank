import React, { useRef } from "react";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import useAuth from "../Hooks/useAuth";
import useModal from "../Hooks/useModal";

const UpdateProfileForm = () => {
  const router = useRouter();
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
  const UpdateNicknameInputRef = useRef<HTMLInputElement>(null);
  const UpdateNicknameInput = () => {
    return <input ref={UpdateNicknameInputRef} placeholder="닉네임" />;
  };

  const onUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (UpdateNicknameInputRef.current?.value === "") return;

    try {
      await updateProfile(currentUser, {
        displayName: UpdateNicknameInputRef.current?.value,
      });
      router.push("/");
    } catch (error) {
      alert("프로필 수정 중에 오류가 발생했습니다.");
      console.log(error);
    }
  };

  return (
    <>
      {isShowing ? (
        <form onSubmit={(event) => onUpdateProfile(event)}>
          <UpdateNicknameInput />
          <button type="button" onClick={toggle}>
            취소
          </button>
          <button>수정하기</button>
        </form>
      ) : (
        <>
          <h1>{currentUser?.displayName}</h1>
          <button onClick={toggle}>닉네임 변경하기</button>
        </>
      )}
    </>
  );
};
export default UpdateProfileForm;
