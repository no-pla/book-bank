import React, { useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet";
import { deleteUser } from "firebase/auth";
import { DB_LINK } from "@/share/server";
import useAuth from "@/components/Hooks/useAuth";
import useModal from "@/components/Hooks/useModal";
import ErrorModal from "@/components/Custom/ErrorModal";
import ConfirmModal from "@/components/Custom/ConfirmModal";
import PreviousChart from "@/components/Banking/PreviousChart";
import { UpdateProfileForm } from "@/components/Auth/UpdateProfileForm";

const Setting = () => {
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
  const [openError, setOpenError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string[]>(["", ""]);

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
      toggle();
      if (code === "auth/requires-recent-login") {
        setErrorMessage([
          "오류가 발생했습니다.",
          "회원 탈퇴를 하고 싶으시면 재로그인 후 시도해 주세요.",
        ]);
        setOpenError((prev) => !prev);
        return;
      } else {
        setErrorMessage([
          "예상치 못한 오류가 발생했습니다.",
          "다시 시도해 주세요.",
        ]);
        setOpenError((prev) => !prev);
        return;
      }
    }
  };

  return (
    <SettingPage>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="독서 기록 남기기" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="독서, 독후감, 독서 기록, 독서기록장" />
        <title>Book Bank / 설정</title>
      </Helmet>
      {openError && (
        <ErrorModal
          title={errorMessage[0]}
          content={errorMessage[1]}
          toggle={() => setOpenError((prev) => !prev)}
        />
      )}
      {isShowing && (
        <ConfirmModal
          title="정말로 탈퇴할까요?"
          content="이 작업은 되돌릴 수 없습니다!"
          toggle={toggle}
          onFunc={onWithdrawal}
        />
      )}
      <div>
        <UpdateProfileForm />
        <PreviousChart />
      </div>
      <section>
        <WithdrawalButton onClick={toggle}>회원탈퇴</WithdrawalButton>
      </section>
    </SettingPage>
  );
};

export default Setting;

const SettingPage = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: spb;
  @media (max-width: 600px) {
  }
`;

const WithdrawalButton = styled.button`
  background-color: transparent;
  border: none;
  color: var(--point-color2);
  float: right;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  margin: 8px;
  font-size: 0.8rem;
`;
