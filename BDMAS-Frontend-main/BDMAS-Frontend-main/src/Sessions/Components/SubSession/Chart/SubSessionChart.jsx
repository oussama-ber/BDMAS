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
const SubSessionChart = (props) => {
  const [chartType, setChartType] = useState("Radar");

  const chartTypeHandler = (event) => {
    setChartType(event.target.value);
  };
  const data = props.data;
  //   console.log(`data : ${JSON.stringify(data)}`);
  // Schema: [{question1},{question2}, ...]
  console.log(`data ${data}`);
  if (data) {
    const schema = JSON.parse(data[0].answer).answer.map((item, index) => {
      return {
        questionNum: index + 1,
        question: item.question,
        type: item.type,
      };
    });
    console.log(`schema ${JSON.stringify(schema)}`);
    //   loop into all answers and return: [{question, questionNum,type, quetsionAverage, },{}..]

    const formAnswers = data.map((form, formIndex) => {
      //   console.log(`JSON.parse(form.answer).answer : ${JSON.stringify(JSON.parse(form.answer).answer)}`)
      const answers = JSON.parse(form.answer).answer.map((item, index) => {
        if (item.type === "radiogroup" || item.type === "rating") {
          return {
            questionNum: index + 1,
            questionVal: +item.value * +item.coef,
          };
        } else if (item.type === "checkbox") {
          let sum = 0;
          item.answersWithVal.map((option) => {
            sum = sum + +option.value * +item.coef;
          });
          return {
            questionNum: index + 1,
            questionVal: sum / item.answersWithVal.length,
          };
        }
      });
      console.log(`answers ${JSON.stringify(answers)}`);

      return answers;
    });

    console.log(`formAnswers ${JSON.stringify(formAnswers)}`);

    let resultResult;

    if (formAnswers.length === 1) {
      const resultts = JSON.parse(data[0].answer).answer.map((item, index) => {
        if (item.type === "radiogroup" || item.type === "rating") {
          return {
            questionNum: index + 1,
            questionScore: +item.value * +item.coef,
          };
        } else if (item.type === "checkbox") {
          let sum = 0;
          item.answersWithVal.map((option) => {
            sum = sum + +option.value * +item.coef;
          });
          return {
            questionNum: index + 1,
            questionScore: sum / item.answersWithVal.length,
          };
        }
      });
      resultResult = resultts;
    } else {
      const finalResult = data.map((item, index) => {
        const answerss = formAnswers.map((questions) => {
          const filtredQuestions = questions.filter(
            (question) => question.questionNum == index + 1
          );

          let qSum = 0;
          let qAverage = 0;
          filtredQuestions.map((item) => {
            qSum = qSum + item.questionVal;
          });
          qAverage = qSum / filtredQuestions.length;
          return { questionNum: index + 1, questionScore: qAverage };
        });
        console.log(`answerss ${JSON.stringify(answerss)}`);
        let qSum = 0;
        let qAverage = 0;
        answerss.map((item) => {
          qSum = qSum + item.questionScore;
        });
        qAverage = qSum / answerss.length;
        return { questionNum: index + 1, questionScore: qAverage };
      });
      resultResult = finalResult;
    }
    console.log(`finalResult ${JSON.stringify(resultResult)}`);

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
        {resultResult && chartType === "Line" && (
          <ResponsiveContainer width={600} height={300}>
            <LineChart
              data={resultResult}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              title={{
                value: "AXEs digital maturity",
                offset: 0,
                position: "insideTop",
              }}
            >
              <Line type="monotone" dataKey="questionScore" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Label
                value="AXEs digital maturity"
                offset={0}
                position="insideTop"
              />
              <XAxis dataKey="questionNum" />
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
        {resultResult && chartType === "Radar" && (
          <RadarChart
            outerRadius={90}
            width={600}
            height={250}
            data={resultResult}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="questionNum" />
            <PolarRadiusAxis angle={90} domain={[0, 5]} />
            <Radar
              dataKey="questionScore"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />

            <Legend />
            <Tooltip />
          </RadarChart>
        )}
        {/* BAR CHART */}
        {resultResult && chartType === "Bar" && (
          <BarChart width={700} height={250} data={resultResult}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="questionNum" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="questionScore" fill="#8884d8" />
          </BarChart>
        )}
      </Grid>
    );
  } else {
    return <Typography>NO DATA</Typography>;
  }
};
export default SubSessionChart;
