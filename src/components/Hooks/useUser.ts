import { DB_LINK } from "@/share/server";
import axios from "axios";
import { useQuery } from "react-query";

const useUser = (uid: string) => {
  const { data: userInfo } = useQuery(
    "getReadBookInfo",
    async () => {
      return await axios.get(`${DB_LINK}/review?uid=${uid}`);
    },
    {
      select: (data) => data.data,
      enabled: !!uid,
    }
  );
  return userInfo;
};

export default useUser;
