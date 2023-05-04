import { useEffect } from "react";
import { useQueryClient } from "react-query";
import useUser from "@/components/Hooks/useUser";

export default function Home({ currentUser }: any) {
  const queryClient = useQueryClient();
  const userInfo = useUser(currentUser?.uid);

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo");
  }, []);

  return (
    <>
      <div>{currentUser?.displayName || "닉네임"}</div>
      <div>{userInfo?.length.toLocaleString("ko-KR")}권</div>
      <div>
        {userInfo
          ?.reduce((cur: number, acc: any) => {
            return cur + acc.price;
          }, 0)
          .toLocaleString("ko-KR")}
        원
      </div>
    </>
  );
}
