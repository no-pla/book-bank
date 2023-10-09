import styled from "@emotion/styled";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

interface Ranking {
  keyword: {
    word: string;
    weight: number;
  };
}

const MontlyKeywordChart = () => {
  const { data: keyword } = useQuery(
    "getMontlyKeyword",
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
      select: ({ data }) => {
        const select = data.response?.keywords.slice(0, 5);
        return select?.map(({ keyword }: Ranking) => keyword.word);
      },
    }
  );

  return (
    <RankingInfo>
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
  );
};

export default MontlyKeywordChart;

const RankingInfo = styled.article`
  box-sizing: border-box;
  text-align: center;
  font-size: 1.1rem;
  padding: 12px;
  background-color: var(--sub-main-color);
  border-radius: 12px;
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
