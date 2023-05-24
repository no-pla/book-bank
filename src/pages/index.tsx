import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Helmet } from "react-helmet";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import styled from "@emotion/styled";
import useUser from "@/components/Hooks/useUser";
import { FiSettings } from "react-icons/fi";
import Chart from "@/components/Banking/Chart";

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
      select: (data) => data?.data.response.keywords.slice(0, 10),
    }
  );

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
        <UserInfo>
          <Image
            src={
              currentUser?.photoURL ||
              "https://firebasestorage.googleapis.com/v0/b/bookbank-e46c2.appspot.com/o/34AD2.jpg?alt=media&token=0c4ebb6c-cc17-40be-bdfb-aba945649039"
            }
            height={100}
            width={100}
            alt={`${currentUser?.displayName} 님의 프로필 사진입니다.`}
          />
          <UserName>{currentUser?.displayName || "닉네임 없음"}</UserName>
          <Link href="/user/setting">
            <span>
              <FiSettings />
              프로필 설정
            </span>
          </Link>
        </UserInfo>
        <BankingInfo>
          <BankName>
            {currentUser?.displayName || "닉네임 없음"}&nbsp;님의 독서 통장
          </BankName>
          <BankAmount>
            {userInfo
              ?.reduce((cur: number, acc: any) => {
                return cur + acc.price;
              }, 0)
              .toLocaleString("ko-KR") || 0}
          </BankAmount>
          <BankPage>
            <Link href="/banking">내역 보기</Link>
            <Link href="/banking/deposit">입금하기</Link>
          </BankPage>
        </BankingInfo>
        <RankingInfo>
          <RankingTitle>최근 인기 도서 키워드</RankingTitle>
          <RankingList>
            {keywords ? (
              keywords?.map(({ keyword }: any, index: number) => {
                return (
                  <li key={index}>
                    {index + 1}.&nbsp;{keyword?.word}
                  </li>
                );
              })
            ) : (
              <Message>최근 인기 키워드 데어터가 없습니다.</Message>
            )}
          </RankingList>
        </RankingInfo>
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

const UserInfo = styled.section`
  width: 20vw;
  background-color: var(--sub-main-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  border-radius: 12px;
  box-sizing: border-box;
  > img {
    border-radius: 50%;
    margin: 12px 0;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    order: -1;
    width: 48%;
  }
  @media (max-width: 600px) {
    width: 100%;
    padding: 20px 0;
    box-sizing: border-box;
  }
  > a > span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-weight: 100;
  }
`;

const UserName = styled.div`
  margin-bottom: 16px;
  font-weight: 800;
  font-size: 1.4rem;
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

const BankAmount = styled.span`
  font-weight: 800;
  font-size: 2rem;
  &::after {
    content: "원";
  }
`;

const BankPage = styled.div`
  > a {
    cursor: pointer;
  }
  > a:first-of-type::after {
    content: "|";
    padding: 0 12px;
  }
`;

const RankingInfo = styled.section`
  width: 20vw;
  background-color: var(--sub-main-color);
  border-radius: 20px;
  padding: 12px;
  box-sizing: border-box;
  text-align: center;
  height: 100%;
  overflow-y: scroll;
  @media (max-width: 768px) {
    width: 48%;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const RankingTitle = styled.div`
  font-weight: 800;
  margin: 8px 0;
  font-size: 1.5rem;
`;

const RankingList = styled.ul`
  margin-top: 4px;
  border-radius: 12px;
  overflow-y: scroll;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  font-weight: 300;
  font-size: 1.2rem;
`;

const Message = styled.li`
  text-align: center;
`;
