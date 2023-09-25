import { useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { deleteUser } from "firebase/auth";
import { DB_LINK } from "@/share/server";
import useAuth from "@/components/Hooks/useAuth";
import useModal from "@/components/Hooks/useModal";
import PreviousChart from "@/components/Banking/Chart/PreviousChart";
import UpdateProfileForm from "@/components/Auth/UpdateProfileForm";
import { Helmet } from "react-helmet";
import dynamic from "next/dynamic";

const ConfirmModal = dynamic(() => import("@/components/Custom/ConfirmModal"), {
  ssr: false,
});
const ErrorModal = dynamic(() => import("@/components/Custom/ErrorModal"), {
  ssr: false,
});

interface IBook {
  title: string;
  publisher: string;
  price: number;
  id: string;
  authors?: string[] | string;
  thumbnail: string;
  review: string;
  uid: string;
  createdAt: number;
  createdYear: number;
  createdMonth: number;
  createdDay: number;
}

const Setting = () => {
  const currentUser = useAuth();
  const { isShowing, toggle } = useModal();
  const [openError, setOpenError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string[]>(["", ""]);

  const deleteUserBookReview = async (uid: string) => {
    try {
      const { data } = await axios.get(`${DB_LINK}/review?uid=${uid}`);
      const promise = data.forEach(async (review: IBook) => {
        return await axios.delete(`${DB_LINK}/review/${review.id}`);
      });
      await Promise.all(promise);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUserProfile = async (uid: string) => {
    try {
      // 프로필 삭제 성공
      await axios.delete(`${DB_LINK}/users/${uid}`).then(async () => {
        await deleteUserBookReview(uid);
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
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="독서 기록 남기기" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="독서, 독후감, 독서 기록, 독서기록장" />
        <title>Book Bank / 마이 페이지</title>
      </Helmet>
      <SettingPage>
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
        <ContentContainer>
          <UpdateProfileForm />
          <PreviousChart />
        </ContentContainer>
        <WithdrawalContainer>
          <WithdrawalButton onClick={toggle}>회원탈퇴</WithdrawalButton>
        </WithdrawalContainer>
      </SettingPage>
    </>
  );
};

export default Setting;

const WithdrawalContainer = styled.div`
  margin-top: 12px;
`;

const ContentContainer = styled.article`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SettingPage = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const WithdrawalButton = styled.button`
  background-color: transparent;
  border: none;
  color: var(--point-color2);
  float: right;
  display: flex;
  justify-content: flex-end;
`;
