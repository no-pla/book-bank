import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Helmet } from "react-helmet";
import styled from "@emotion/styled";
import Chart from "@/components/Banking/Chart";
import { auth } from "@/share/firebase";
import Ranking from "@/components/Banking/Ranking";
import BankBook from "@/components/Banking/BankBook";
import { useRouter } from "next/router";
import UserProfile from "@/components/Auth/UserProfile";

export default function Home() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo");
  }, []);

  return (
    <Container>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="독서 기록 남기기" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="독서, 독후감, 독서 기록, 독서기록장" />
        <title>Book Bank</title>
      </Helmet>
      <InfoContainer>
        <UserProfile />
        <BankingInfo>
          <BankName>
            {auth.currentUser?.displayName || "닉네임 없음"}&nbsp;님의 독서 통장
          </BankName>
          <BankBook
            onclick={() => router.push("/banking")}
            text="내역 보기"
            secondOnClick={() => router.push("/banking/deposit")}
            secondText="입금하기"
            transform="10%"
          />
        </BankingInfo>
        <Ranking />
      </InfoContainer>
      <Chart />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 100px;
  @media (max-width: 768px) {
    gap: 250px;
  }
  @media (max-width: 600px) {
    gap: 60px;
  }
`;

const InfoContainer = styled.section`
  display: flex;
  gap: 20px;
  width: 100%;
  height: 200px;
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    height: 100%;
  }
`;

const BankingInfo = styled.section`
  width: 60vw;
  background-color: var(--sub-main-color);
  box-sizing: border-box;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  @media (max-width: 768px) {
    order: 1;
    width: 100%;
    height: 100%;
  }
  @media (max-width: 600px) {
    order: 0;
    width: 100%;
    height: 200px;
  }
`;

const BankName = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  font-weight: 400;
  font-size: 1.4rem;
`;
