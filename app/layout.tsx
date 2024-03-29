import { Metadata } from "next";
import Providers from "@/utils/providers";
import "@/style/reset.css";

export const metadata: Metadata = {
  description: "독서 기록 남기기",
  viewport: "width=device-width, initial-scale=1.0",
  keywords: "독서, 독후감, 독서 기록, 독서기록장",
};

export default function RootLayout({
  // 루트 레이아웃은 서버 컴포넌트이어야 하고 클라이언트로 사용할 수 없다.
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <meta charSet="utf-8" />
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />
      <body>
        <Providers>
          <div id="portal" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
