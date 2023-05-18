import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import styled from "@emotion/styled";
import Chart from "@/components/Banking/Chart";
import useUser from "@/components/Hooks/useUser";

export default function Home({ currentUser }: any) {
  const queryClient = useQueryClient();
  const userInfo = useUser(currentUser?.uid);

  const { data: keywords } = useQuery(
    "getMonthlyKeyword",
    async () => {
      return await axios.get(
        `http://data4library.kr/api/monthlyKeywords?authKey=${
          process.env.NEXT_PUBLIC_BIG_DATA_KEY
        }&month=${
          new Date().getFullYear() +
          "-" +
          String(new Date().getMonth()).padStart(2, "0")
        }&format=json`
      );
    },
    {
      select: (data) => data?.data.response.keywords.slice(0, 5),
    }
  );

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo");
  }, []);

  return (
    <Container>
      <InfoContainer>
        <UserInfo>
          <Image
            src={
              currentUser?.photoURL ||
              "https://firebasestorage.googleapis.com/v0/b/bookbank-e46c2.appspot.com/o/34AD2.jpg?alt=media&token=0c4ebb6c-cc17-40be-bdfb-aba945649039"
            }
            height={100}
            width={100}
            alt={`${currentUser?.displayName} 님의 프로필 사진입니다.`}
            style={{ borderRadius: "50%" }}
          />
          <div>{currentUser?.displayName || "닉네임 없음"}</div>
        </UserInfo>
        <BankingInfo>
          <div>
            {currentUser?.displayName || "닉네임 없음"}&nbsp;님의 독서 통장
          </div>
          <div>
            {userInfo
              ?.reduce((cur: number, acc: any) => {
                return cur + acc.price;
              }, 0)
              .toLocaleString("ko-KR") || 0}
            원
          </div>
          <div>
            <Link href="/banking">내역 보기</Link>
            <Link href="/banking/deposit">입금하기</Link>
          </div>
        </BankingInfo>
        <UserInfo>
          <div>최근 인기 도서 키워드</div>
          <ul>
            {keywords?.map(({ keyword }: any, index: number) => {
              return (
                <li key={index}>
                  {index + 1}.&nbsp;{keyword?.word}
                </li>
              );
            })}
          </ul>
        </UserInfo>
      </InfoContainer>
      <Chart currentUser={currentUser} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 100px;

  @media (max-width: 600px) {
    gap: 60px;
  }
`;

const InfoContainer = styled.section`
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const UserInfo = styled.section`
  width: 20vw;
  background-color: var(--main-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  border-radius: 12px;
  height: 200px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const BankingInfo = styled.section`
  width: 60vw;
  background-color: var(--main-color);
  box-sizing: border-box;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  @media (max-width: 600px) {
    width: 100%;
    height: 200px;
  }
`;
