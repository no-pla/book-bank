import useUser from "@/components/Hooks/useUser";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";

const Index = ({ currentUser }: any) => {
  const queryClient = useQueryClient();
  const userInfo = useUser(currentUser?.uid);

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo");
  }, []);

  return <div>{userInfo?.length.toLocaleString("ko-KR")}권</div>;
};

export default Index;
