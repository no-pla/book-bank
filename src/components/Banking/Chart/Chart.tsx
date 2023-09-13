import React from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { DB_LINK } from "@/share/server";
import styled from "@emotion/styled";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  /**
   * next.js는 pre-rendering을 하는데 서버 사이드에서 코드를 실행할 때는
   * window가 존재하지 않는 상태이기 때문에 오류가 발생한다. 그렇게 때문에
   * Lazy Loading을 사용하여 렌더링을 했다.
   */
  ssr: false,
});

const Chart = ({ currentUser }: any) => {
  const defaultData = [
    {
      name: "1주차",
      data: [0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "2주차",
      data: [0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "3주차",
      data: [0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "4주차",
      data: [0, 0, 0, 0],
    },
  ];

  const { data: series, isFetched } = useQuery(
    "getCurrentMonthData",
    async () => {
      let month = new Date().getMonth() + 1;
      return await axios.get(
        `${DB_LINK}/review?uid=${
          currentUser.uid
        }&_sort=_createdDay&_order=desc&createdYear=${new Date().getFullYear()}&createdMonth=${month}`
      );
    },
    {
      enabled: !!currentUser,
      select: ({ data }) => {
        const tempArray: number[] = new Array(31).fill(0);
        data.forEach((monthlyReview: any) => {
          tempArray[monthlyReview.createdDay - 1] += 1;
        });

        return [
          {
            name: "1일 ~ 10일",
            data: tempArray.slice(0, 10),
          },
          {
            name: "11일 ~ 20일",
            data: tempArray.slice(10, 20),
          },
          {
            name: "21일 ~ 30일",
            data: tempArray.slice(20, 30),
          },
          {
            name: "31일",
            data: tempArray.slice(30),
          },
        ];
      },
    }
  );

  return (
    <Container>
      {series && (
        <DynamicChart
          options={{
            chart: {
              type: "heatmap",
            },
            xaxis: {
              type: "category",
              categories: [
                "1일",
                "2일",
                "3일",
                "4일",
                "5일",
                "6일",
                "7일",
                "8일",
                "9일",
                "10일",
              ],
            },
            dataLabels: {
              enabled: true,
              style: {
                colors: ["#000"],
              },
            },
            colors: ["#d1d1e0"],
            title: {
              text: `${new Date().getMonth() + 1}월 독서량`,
              align: "center",
            },
            plotOptions: {
              heatmap: {
                shadeIntensity: 0.5,
                radius: 4,
                useFillColorAsStroke: true,
              },
            },
            responsive: [
              {
                breakpoint: 500,
                options: {
                  chart: {
                    width: 500,
                  },
                },
              },
            ],
          }}
          series={isFetched ? series : defaultData}
          type="heatmap"
          height={240}
        />
      )}
    </Container>
  );
};

export default Chart;

const Container = styled.section`
  margin-top: 100px;
  @media (max-width: 768px) {
    margin-top: 40px;
  }
  @media (max-width: 500px) {
    overflow-x: scroll;
    overflow-y: hidden;
  }
`;
