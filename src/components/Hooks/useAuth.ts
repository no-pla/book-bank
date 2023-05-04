import { auth } from "@/share/firebase";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        // 로그인 X 일때 | 기본적으로 login 페이지로 이동
        if (router.pathname !== "/register") {
          return router.push("/login");
        }
        return;
      }

      if (router.pathname === "/login" || router.pathname === "/register") {
        return router.push("/");
      }
      setUser(currentUser);
    });
    return unSub;
    /*
     * useEffect를 이용하여 이벤트 리스너 등록 시 메모리 누수를 막기 위해 unSubscribe를 해주어야 한다.
     */
  }, [router, router.pathname]);
  return user;
};

export default useAuth;
