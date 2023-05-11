import React from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { DB_LINK } from "@/share/server";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  /* next.js는 pre-rendering을 하는데 서버 사이드에서 코드를 실행할 때는
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
    async () =>
      await axios.get(
        `${DB_LINK}/review?uid=${
          currentUser.uid
        }&_sort=_createdDay&_order=desc&_createdYear=${new Date().getFullYear()}&_createdMonth=${
          new Date().getMonth() + 1
        }`
      ),
    {
      enabled: !!currentUser,
      select: ({ data }) => {
        const tempArray: number[] = new Array(31).fill(0);
        data.forEach((monthlyReview: any) => {
          tempArray[monthlyReview.createdDay - 1] += 1;
        });

        return [
          {
            name: "1일",
            data: tempArray.slice(0, 10),
          },
          {
            name: "10일",
            data: tempArray.slice(10, 20),
          },
          {
            name: "20일",
            data: tempArray.slice(20, 30),
          },
          {
            name: "30일",
            data: tempArray.slice(30),
          },
        ];
      },
    }
  );

  return (
    <>
      {series && (
        <DynamicChart
          options={{
            chart: {
              type: "heatmap",
            },
            xaxis: {
              type: "category",
              categories: [
                "1번째 날",
                "2번째 날",
                "3번째 날",
                "4번째 날",
                "5번째 날",
                "6번째 날",
                "7번째 날",
                "8번째 날",
                "9번째 날",
                "10번째 날",
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
          }}
          series={isFetched ? series : defaultData}
          type="heatmap"
          height={320}
        />
      )}
    </>
  );
};

export default Chart;