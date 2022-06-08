import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const Chart = (props) => {
  const data = [
    { name: "Axe1", score: 400 },
    { name: "Axe2", score: 500 },
    { name: "Axe3", score: 600 },
    { name: "Axe4", score: 500 },
    { name: "Axe5", score: 500 },
    { name: "Axe6", score: 500 },
  ];

  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="score" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};
export default Chart;
