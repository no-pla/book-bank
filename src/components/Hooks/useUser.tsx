import { DB_LINK } from "@/share/server";
import axios from "axios";
import { useQuery } from "react-query";

const useUser = (uid: string) => {
  const { data } = useQuery(
    "getUserInfo",
    async () => {
      return await axios.get(`${DB_LINK}/users/${uid}`);
    },
    {
      select: (data) => data.data,
      enabled: !!uid,
    }
  );
  return data;
};

export default useUser;
