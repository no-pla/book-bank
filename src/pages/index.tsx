import { useEffect } from "react";
import { useQueryClient } from "react-query";
import useUser from "@/components/Hooks/useUser";

export default function Home({ currentUser }: any) {
  const queryClient = useQueryClient();
  const userInfo = useUser(currentUser?.uid);

  console.log("메인 리렌더");

  useEffect(() => {
    queryClient.invalidateQueries("getUserInfo");
  }, []);

  return (
    <h1>
      {currentUser?.displayName || "닉네임"}
      <br />
      {userInfo?.totalBook || 0}권
    </h1>
  );
}
