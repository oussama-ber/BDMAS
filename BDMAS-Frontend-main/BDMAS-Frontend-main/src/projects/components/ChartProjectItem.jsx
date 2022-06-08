import React, { useState, useEffect } from "react";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend
);
const ChartProjectItem = () => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ["AXE1", "AXE2", "AXE3", "AXE4", "AXE5", "AXE6"],
      datasets: [
        {
          label: "Value",
          data: [12, 23, 34, 45, 30, 32],
          borderColor: "rgb(52,162 ,235)",
          backgroundColor: "rgba(53,162,235,0.4)",
        },
      ],
      
    });
    setChartOptions({
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Stats Chart" },
      },
      
        scales: {
          xAxes: {
            display: true,
            title: {
              display: true,
              text: "Axes",
              color: "#1A1A24",
            },
          },
          yAxes: {
            display: true,
            title: {
              display: true,
              text: "Value",
              color: "#1A1A24",
            },
          },
        },
      
    });
  }, []);

  const data = {
    datasets: [{ data: [10, 20, 30] }],
    labels: ["Red", "Yellow", "Blue"],
  };
  return <Bar options={chartOptions} data={chartData} />;
};
export default ChartProjectItem;
