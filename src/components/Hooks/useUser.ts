import axios from "axios";
import { useQuery } from "react-query";

const useUser = (uid: string) => {
  const { data: userInfo } = useQuery(
    "getReadBookInfo",
    async () => {
      return await axios.get(`http://localhost:3001/review?uid=${uid}`);
    },
    {
      select: (data) => data.data,
      enabled: !!uid,
    }
  );
  return userInfo;
};

export default useUser;
