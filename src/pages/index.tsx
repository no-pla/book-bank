import axios from "axios";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import useAuth from "@/components/Hooks/useAuth";
import Chart from "@/components/Banking/Chart/Chart";
import BankBook from "@/components/Banking/BankBook";
import UserProfile from "@/components/Auth/UserProfile";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Helmet } from "react-helmet";

interface Rank {
  keyword: string[];
}

interface Ranking {
  keyword: {
    word: string;
    weight: number;
  };
}

export const getStaticProps: GetStaticProps<Rank> = async () => {
  const res = await axios.get(
    `http://data4library.kr/api/monthlyKeywords?authKey=${
      process.env.NEXT_PUBLIC_BIG_DATA_KEY
    }&month=${
      new Date().getFullYear() +
      "-" +
      String(new Date().getMonth()).padStart(2, "0")
    }&format=json`
  );
  const select = res?.data.response?.keywords.slice(0, 5);
  const keyword = select?.map(({ keyword }: Ranking) => keyword.word);
  return { props: { keyword } };
};

export default function Home({
  keyword,
}: InferGetStaticPropsType<GetStaticProps>) {
  const currentUser = useAuth();
  const router = useRouter();

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="독서 기록 남기기" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="독서, 독후감, 독서 기록, 독서기록장" />
        <title>Book Bank</title>
      </Helmet>
      <InfoContainer>
        <UserProfile />
        <BankBook
          onClick={() => router.push("/banking")}
          text="내역 보기"
          secondOnClick={() => router.push("/banking/deposit")}
          secondText="입금하기"
          transform="10%"
        >
          <span>
            {currentUser?.displayName || "닉네임 없음"}&nbsp;님의 독서 통장
          </span>
        </BankBook>
        <RankingInfo>
          {/* getServerSideProps는 컴포넌트에서는 사용 불가 페이지에서만 가능*/}
          <RankingTitle>인기 도서 키워드</RankingTitle>
          <RankingList>
            {keyword?.map((keyword: string, index: number) => {
              return (
                <li key={index}>
                  {index + 1}.&nbsp;{keyword}
                </li>
              );
            })}
          </RankingList>
        </RankingInfo>
      </InfoContainer>
      <Chart currentUser={currentUser} />
    </>
  );
}

const InfoContainer = styled.section`
  display: flex;
  gap: 12px;
  > article {
    height: 212px;
    border-radius: 12px;
    background-color: var(--sub-main-color);
  }
  > article:nth-of-type(1) {
    flex-grow: 1;
    flex-basis: 20%;
  }
  > div {
    height: 212px;
    flex-grow: 2;
  }
  > article:nth-of-type(2) {
    flex-basis: 20%;
    flex-grow: 1;
  }
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 16px;
    > article:nth-of-type(1) {
      order: -1;
    }
    > div {
      order: 1;
    }
  }
  @media (max-width: 600px) {
    gap: 20px;
    flex-direction: column;
    > article:nth-of-type(1) {
      width: 100%;
      padding-bottom: 20px;
    }
    > div {
      order: 0;
    }
  }
`;

const RankingInfo = styled.article`
  box-sizing: border-box;
  text-align: center;
  font-size: 1.1rem;
  padding: 12px;
  @media (max-width: 768px) {
    width: 48%;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const RankingTitle = styled.div`
  font-weight: 800;
  font-size: 1rem;
  padding: 4px 0;
`;

const RankingList = styled.ul`
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 8px;
  text-align: left;
  font-size: 0.9rem;
  margin-top: 12px;
  border-radius: 12px;
  @media (max-width: 768px) {
    padding: 24px 8px;
  }
`;
