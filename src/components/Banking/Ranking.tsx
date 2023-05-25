import styled from "@emotion/styled";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

const Ranking = () => {
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
  return (
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
  );
};

export default Ranking;

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
