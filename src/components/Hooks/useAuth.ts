import { auth } from "@/share/firebase";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const useAuth = () => {
  const [user, setUser] = useState<any>();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async (currentUser: any) => {
      if (!currentUser) {
        // 로그인이 되어 있지 않으면 로그인 페이지로 이동 (로그인 & 회원가입 페이지인 경우는 제외)
        if (pathname !== "/login" && pathname !== "/register") {
          router.push("/login");
        }
      } else {
        if (pathname === "/login" || pathname === "/register") {
          router.push("/");
        }
      }
      setUser(currentUser);
    };

    return auth.onAuthStateChanged(checkLogin);
  }, [pathname]);
  return user;
};

export default useAuth;
