import React from "react";
import axios from "axios";
import { deleteUser } from "firebase/auth";
import useAuth from "@/components/Hooks/useAuth";
import useModal from "@/components/Hooks/useModal";
import { DB_LINK } from "@/share/server";
import ErrorModal from "@/components/Custom/ErrorModal";
import UpdateProfileForm from "@/components/Auth/UpdateProfileForm";

const Setting = () => {
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();

  const deleteUserBookReview = async (uid: string) => {
    // 유저가 작성한 게시글 전체 가져옴
    const reviewIdList: any = [];
    const { data } = await axios.get(`${DB_LINK}/review?uid=${uid}`);
    data.forEach((review: any) => {
      reviewIdList.push(review.id);
    });
    //  forEach 실행 종료 후 실헹하기 위해 promise 사용
    const promise = reviewIdList.map(async (id: string) => {
      return await axios.delete(`${DB_LINK}/review/${id}`);
    });

    return Promise.all(promise);
  };

  const deleteUserProfile = async (uid: string) => {
    try {
      // 프로필 삭제 성공
      await axios.delete(`${DB_LINK}/users/${uid}`).then(() => {
        deleteUserBookReview(uid);
      });
    } catch (error) {
      // 프로필 db 삭제 실패
      console.log(error);
    }
  };

  const onWithdrawal = async () => {
    try {
      await deleteUser(currentUser).then(() => {
        // firebase 삭제 성공
        deleteUserProfile(currentUser?.uid);
      });
    } catch ({ code }: any) {
      if (code === "auth/requires-recent-login") {
        alert("회원 탈퇴를 하고 싶으시면 재로그인 후 시도해 주세요.");
      }
    }
  };

  return (
    <div>
      {isShowing && (
        <ErrorModal
          title="정말로 탈퇴할까요?"
          content="이 작업은 되돌릴 수 없습니다!"
          toggle={toggle}
          onFunc={onWithdrawal}
        />
      )}
      <div>회원 탈퇴</div>
      <button onClick={() => toggle()}>회원탈퇴</button>
      <UpdateProfileForm />
    </div>
  );
};

export default Setting;