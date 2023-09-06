import axios from "axios";
import { useQuery } from "react-query";
import { DB_LINK } from "@/share/server";

const useUserDepositList = (uid: string) => {
  const { data: userBookList } = useQuery(
    "getReadBookInfo",
    async () => {
      return await axios.get(`${DB_LINK}/review?uid=${uid}`);
    },
    {
      select: (data) => data.data,
      enabled: !!uid,
    }
  );
  return userBookList;
};

export default useUserDepositList;
