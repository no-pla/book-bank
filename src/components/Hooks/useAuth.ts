import { auth } from "@/share/firebase";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const useAuth = () => {
  const [user, setUser] = useState<any>();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        // 로그인 X 일때 | 기본적으로 login 페이지로 이동
        if (pathname !== "/login" && pathname !== "/register") {
          // 로그인 & 회원 가입 페이지가 아니면 로그인 페이지로
          return router.push("/login");
        }
      } else {
        if (pathname === "/login" || pathname === "/register") {
          return router.push("/");
        }
      }
      setUser(currentUser);
    });
    return unSub;
    /**
     * useEffect를 이용하여 이벤트 리스너 등록 시 메모리 누수를 막기 위해 unSubscribe를 해주어야 한다.
     */
  }, [pathname]);
  return user;
};

export default useAuth;
