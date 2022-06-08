import React, { useState } from "react";
import {
  LineChart,
  Label,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
} from "recharts";
//mui
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const DChart = (props) => {
  const data = props.data;
  const [chartType, setChartType] = useState("Radar");

  const chartTypeHandler = (event) => {
    setChartType(event.target.value);
  };

  // console.log("data" + JSON.stringify(data));
  const schemaAxes = props.schema;
  if (data) {
    console.log("schemaAxes" + JSON.stringify(schemaAxes));

    const theSchema = schemaAxes.map((item, indexx) => {
      console.log(`item ${JSON.stringify(item)}, # ${indexx} `);
      // filter the answers per axe.
      const filtredAnswers = data.filter((answer, index) => {
        return answer.subSessionRef === item.id;
      });
      console.log(`filtredAnswers ${JSON.stringify(filtredAnswers)}`);
      // calculate the average form.
      const _filtredAnswers = filtredAnswers.map((question) => {
        console.log(
          `the waited results: ${JSON.stringify(
            JSON.parse(question.answer).answer
          )}`
        );
        // calculate th e
        // Calculate the question value; return value * coef.
        const questions = JSON.parse(question.answer).answer.map((item) => {
          if (item.type === "radiogroup" || item.type === "rating") {
            return +item.value * +item.coef;
          } else if (item.type === "checkbox") {
            let sum = 0;
            item.answersWithVal.map((option, index) => {
              sum = sum + +option.value * +item.coef;
            });
            return sum / item.answersWithVal.length;
          }
        });
        // calculate the average.
        let questionsAverage;
        let questionsSum = 0;
        questions.map((question) => {
          questionsSum = questionsSum + question;
        });

        questionsAverage = questionsSum / questions.length;
        console.log(
          `questionsSum:  ${questionsSum}, questions.length ${questions.length}, and the form average is:  ${questionsAverage}`
        );

        return questionsAverage;
      });
      console.log(
        `_______filtredAsnwers ${_filtredAnswers}; and the length is ${_filtredAnswers.length}`
      );
      let filtredSum = 0;
      let filtredAverage = 0;
      _filtredAnswers.map((item) => {
        filtredSum = filtredSum + item;
      });
      filtredAverage = filtredSum / _filtredAnswers.length + 1;
      if (filtredAnswers.length >= 0) {
        return { name: item.axeName, score: filtredAverage };
      }
    });
    console.log("TheSchema" + JSON.stringify(theSchema));
    let subSessionSum = 0;
    let average = 0;

    const finalAverage = theSchema.map((item) => {
      console.log(`item // ${JSON.stringify(item)}`)
      subSessionSum = subSessionSum + item.score;
    });
    average = subSessionSum / theSchema.length;

    //   [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}]
    console.log("chartType" + chartType);
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {/* TITLE & DROPDOWN */}
        <Grid item container="row" alignItems="center">
          <Grid item lg={8} sx={{ ml: 10 }}>
            <h2>Digital maturity Axes</h2>
          </Grid>
          <Grid item lg={2}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Chart Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={chartType}
                onChange={chartTypeHandler}
                label="Chart Type"
              >
                <MenuItem value={"Line"}>Line</MenuItem>
                <MenuItem value={"Radar"}>Radar</MenuItem>
                <MenuItem value={"Bar"}>Bar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* LINE CHART */}
        {chartType === "Line" && (
          <ResponsiveContainer width={600} height={300}>
            <LineChart
              data={theSchema}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              title={{
                value: "AXEs digital maturity",
                offset: 0,
                position: "insideTop",
              }}
            >
              <Line type="monotone" dataKey="score" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Label
                value="AXEs digital maturity"
                offset={0}
                position="insideTop"
              />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Digital maturity",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        )}
        {/* RADAR CHART */}
        {chartType === "Radar" && (
          <RadarChart
            outerRadius={90}
            width={600}
            height={250}
            data={theSchema}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={90} domain={[0, 5]} />
            <Radar
              dataKey="score"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />

            <Legend />
            <Tooltip />
          </RadarChart>
        )}
        {/* BAR CHART */}
        {chartType === "Bar" && (
          <BarChart width={700} height={250} data={theSchema}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#8884d8" />
          </BarChart>
        )}
        {average && <Typography variant="h6">Average: {average}</Typography>}
      </Grid>
    );
  } else {
    return <Typography>no data</Typography>;
  }
};
export default DChart;
