import Link from "next/link";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import useUser from "@/components/Hooks/useUser";
import { signOut } from "firebase/auth";
import { auth } from "@/share/firebase";

export default function Home({ currentUser }: any) {
  const queryClient = useQueryClient();
  const userInfo = useUser(currentUser?.uid);

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo");
  }, []);

  const onSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
      alert("로그아웃 실패했습니다.");
    }
  };

  return (
    <>
      <div>{currentUser?.displayName || "닉네임 없음"}</div>
      <Link href="/user/setting">프로필 설정</Link>
      <div>{userInfo?.length.toLocaleString("ko-KR")}권</div>
      <div>
        {userInfo
          ?.reduce((cur: number, acc: any) => {
            return cur + acc.price;
          }, 0)
          .toLocaleString("ko-KR")}
        원
      </div>
      <button onClick={onSignOut}>로그아웃</button>
    </>
  );
}
