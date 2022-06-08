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
  RadialBarChart,
  RadialBar,
} from "recharts";
//MUI
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// Components 


const ProjectChart = (props) => {
  const data = props.data;
  const schema = props.schema;
  const [chartType, setChartType] = useState("Bar");
  const chartTypeHandler = (event) => {
    setChartType(event.target.value);
  };

  //   console.log(`dataType: ${typeof data}
  //   data: ${JSON.stringify(data)},
  //   schemaType: ${typeof schema},
  //   schema: ${JSON.stringify(schema)}`);

  // divide answers per session
  const projectAnswers = schema.map((session) => {
    return data.filter((answer) => answer.sessionRef === session.id);
  });
  //   console.log(`____projectAnswers:  ${JSON.stringify(projectAnswers)}`);
  //  loop into sessions array. schema:  [[ session1 asnwers[] ], [ session2 answers[] ], ... ]
  const _sessionAnswers = projectAnswers.map((sessionAnswers) => {
    // console.log(`where am i !!! ${JSON.stringify(sessionAnswers)}`);
    //   loop into session array: schema:  [{formAnswer1}, {formAnswer2}, ...]
    const questions = sessionAnswers.map((item, sessionIndex) => {
      const form = JSON.parse(item.answer).answer;
      //   console.log(`answer  ${sessionIndex}: ${JSON.stringify(form)}`);
      // Calculate the question value; return value * coef. per from, schema: answers [{question1}, {question2}, ...]
      const formAnswers = form.map((question) => {
        if (question.type === "radiogroup" || question.type === "rating") {
          return +question.value * +question.coef;
        } else if (question.type === "checkbox") {
          let sum = 0;
          question.answersWithVal.map((option, index) => {
            sum = sum + +option.value * +question.coef;
          });
          return sum / question.answersWithVal.length;
        }
      });
      console.log(`formAnswers ${formAnswers}`);
      // Calculate the average for the form/answer.
      let questionsAverage;
      let questionsSum = 0;
      formAnswers.map((question) => {
        questionsSum = questionsSum + question;
      });

      questionsAverage = questionsSum / formAnswers.length;

      //   console.log(`item madafakaaaaaaaaaaaa ${item.sessionRef}`);
      return { sessionId: item.sessionRef, sessionAverage: questionsAverage };
    });
    console.log(`questions ${JSON.stringify(questions)}`);
    // TODO make question [{sessionId , sessionAverage}, {}, ...] => {sessionId, sessionAverage}
    let sSum = 0;
    let sAverage = 0;
    if (questions.length >= 1) {
      const sID = questions[0].sessionId;
      questions.map((question) => {
        sSum = sSum + question.sessionAverage;
      });
      sAverage = sSum / questions.length;
      //   get sessionName from schema array
      let sessionName = "";
      schema.map((item) => {
        if (item.id === sID) {
          sessionName = item.sessionName;
        }
      });
      console.log(`
      sessionId: ${sID},
      sessionName: ${sessionName},
      sessionAverage: ${sAverage},`);
      return {
        sessionId: sID,
        name: sessionName,
        sessionAverage: sAverage,
      };
    }
    return;
  });
  const filalResult = _sessionAnswers.filter((item) => !(item == null));
  console.log(`_sessionAnswers ${JSON.stringify(filalResult)}`);
  let sSum = 0;
  let sAverage = 0;
  const sessionsAverage = filalResult.map((item) => {
    sSum = sSum + item.sessionAverage;
  });
  sAverage = sSum / sessionsAverage.length;

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center">
      <Grid item container="row" alignItems="center">
        <Grid item lg={8} sx={{ ml: 10 }}>
          <h2>Digital maturity Sessions</h2>
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
              <MenuItem value={"Radial"}>Radial</MenuItem>
              <MenuItem value={"Bar"}>Bar</MenuItem>
              <MenuItem value={"Radar"}>Radar</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* LINE CHART */}
      {_sessionAnswers && chartType === "Line" && (
        <ResponsiveContainer width={600} height={300}>
          <LineChart
            data={filalResult}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            title={{
              value: "sessions digital maturity",
              offset: 0,
              position: "insideTop",
            }}
          >
            <Line type="monotone" dataKey="sessionAverage" stroke="#8884d8" />
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
      {_sessionAnswers && chartType === "Radial" && (
        <RadialBarChart
          width={730}
          height={250}
          innerRadius="10%"
          outerRadius="80%"
          data={filalResult}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            minAngle={15}
            label={{ fill: "#666", position: "insideStart" }}
            background
            clockWise={true}
            dataKey="sessionAverage"
          />
          <Legend
            iconSize={10}
            width={120}
            height={140}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
          <Tooltip />
        </RadialBarChart>
      )}
        {/* RADAR CHART */}
        {_sessionAnswers && chartType === "Radar" && (
        <RadarChart outerRadius={90} width={600} height={250} data={filalResult}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={90} domain={[0, 5]} />
          <Radar
            dataKey="sessionAverage"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />

          <Legend />
          <Tooltip />
        </RadarChart>
      )}
      {_sessionAnswers && chartType === "Bar" && (
        <BarChart width={700} height={250} data={filalResult}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sessionAverage" fill="#8884d8" />
        </BarChart>
      )}
      {sessionsAverage && sAverage && (
        <Typography variant="h6">Average: {sAverage}</Typography>
      )}
    </Grid>
  );
};
export default ProjectChart;
