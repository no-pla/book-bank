import React, { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useQuery, useQueryClient } from "react-query";
import useAuth from "../Hooks/useAuth";
import useUser from "../Hooks/useUser";
import { DB_LINK } from "@/share/server";
const DynamicChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const PreviousChart = () => {
  const currentUser = useAuth();
  const [targetYear, setTargetYser] = useState<number>(
    new Date().getFullYear()
  );
  const { data: userInfo } = useQuery(
    "getUserInfo",
    async () => {
      return await axios.get(`${DB_LINK}/users/${currentUser?.uid}`);
    },
    {
      enabled: !!currentUser,
      select: (data) => {
        const registerDate = +data?.data.signUpDate.split(". ")[0];
        const today = +new Date().toLocaleDateString().split(". ")[0];
        const tempArray: number[] = [];

        for (let i = today; i >= registerDate; i--) {
          tempArray.push(+i);
        }

        return tempArray;
      },
    }
  );

  const defaultData = [
    {
      name: "월간 독서량",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  const { data, isFetched, refetch } = useQuery(
    ["getParticularData", targetYear],
    async () => {
      return await axios.get(
        `${DB_LINK}/review?_uid=${currentUser?.uid}&createdYear=${targetYear}`
      );
    },
    {
      enabled: !!currentUser,
      select: ({ data }) => {
        const tempArray: number[] = new Array(12).fill(0);
        data.map((monthData: any) => {
          tempArray[monthData.createdMonth - 1] += 1;
        });
        return [
          {
            name: "월간 독서량",
            data: tempArray,
          },
        ];
      },
    }
  );

  return (
    <section>
      <h2>연간 독서량</h2>
      <select
        onChange={(event) => {
          setTargetYser(+event?.currentTarget?.value);
        }}
      >
        {userInfo?.map((year: number) => {
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </select>
      <DynamicChart
        series={isFetched ? data : defaultData}
        type="bar"
        height={250}
        options={{
          chart: {
            type: "bar",
            height: 350,
          },
          xaxis: {
            categories: [
              "1월",
              "2월",
              "3월",
              "4월",
              "5월",
              "6월",
              "7월",
              "8월",
              "9월",
              "10월",
              "11월",
              "12월",
            ],
            position: "bottom",
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val + "권";
            },
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#304758"],
            },
          },
          plotOptions: {
            bar: {
              borderRadius: 10,
              dataLabels: {
                position: "top", // top, center, bottom
              },
            },
          },
        }}
      />
    </section>
  );
};

export default PreviousChart;