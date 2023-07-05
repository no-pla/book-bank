import React, { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import { useQuery } from "react-query";
import { DB_LINK } from "@/share/server";
import useAuth from "@/components/Hooks/useAuth";
import { Title } from "@/components/Auth/UpdateProfileForm";
const DynamicChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const PreviousChart = () => {
  const currentUser = useAuth();
  const registarDate = +new Date(+currentUser?.metadata.createdAt)
    .toLocaleDateString("ko-KR")
    .split(". ")[0];

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
      select: () => {
        const today = +new Date().toLocaleDateString().split(". ")[0];
        const tempArray: number[] = [];
        if (isNaN(registarDate)) return;
        for (let i = today; i >= registarDate; i--) {
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

  const { data, isFetched } = useQuery(
    ["getParticularData", targetYear],
    async () => {
      return await axios.get(
        `${DB_LINK}/review?uid=${currentUser?.uid}&createdYear=${targetYear}`
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
            name: "연간 독서량",
            data: tempArray,
          },
        ];
      },
    }
  );

  return (
    <Section>
      <Title>연간 독서량</Title>
      <div>
        <SelectYears>연도 선택:</SelectYears>
        <Select
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
        </Select>
      </div>
      <DynamicChart
        series={isFetched ? data : defaultData}
        type="bar"
        height={250}
        options={{
          chart: {
            type: "bar",
            height: 350,
          },
          fill: {
            colors: ["#8067a9"],
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
            formatter: (val) => val + "권",
            offsetY: 8,
            style: {
              fontSize: "12px",
              colors: ["#304758"],
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
          plotOptions: {
            bar: {
              borderRadius: 8,
              dataLabels: {
                position: "bottom",
              },
            },
          },
        }}
      />
    </Section>
  );
};

export default PreviousChart;

const Section = styled.section`
  overflow: hidden;
  @media (max-width: 499px) {
    overflow-x: scroll;
    overflow-y: hidden;
  }
`;

const SelectYears = styled.span`
  font-size: 0.9rem;
  margin-right: 4px;
`;

const Select = styled.select`
  padding: 4px 20px 4px 4px;
`;
