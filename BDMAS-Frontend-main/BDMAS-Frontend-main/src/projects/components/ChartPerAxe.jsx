import React, { useState } from "react";

const ChartPerAxe = (props) => {
  const data = props.data;
  const schemaAxes = props.schema;
  const [axe, setAxe] = useState(props.axe);
  const [chartType, setChartType] = useState("Line");
  // chart Type handler.
  const chartTypeHandler = (event) => {
    setChartType(event.target.value);
  };

  //   filtred answers
  const filtredAnswers = data.filter((answer) => {
    return answer.subSessionRef === axe.id;
  });
  const _filtredAnswers = filtredAnswers.map((question)=>{
      
  })
  console.log(`the choosen axe is : ${JSON.stringify(axe)},
  and the filtred answers: ${JSON.stringify(filtredAnswers)}
  `);
  return (
      <React.Fragment>

      </React.Fragment>
  )
};
export default ChartPerAxe;
