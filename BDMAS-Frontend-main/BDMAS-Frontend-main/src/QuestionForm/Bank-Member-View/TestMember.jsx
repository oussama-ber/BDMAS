import React, { useState, useEffect } from "react";

import "survey-react/survey.css";
import * as Survey from "survey-react";
// MUI
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const TestMember = () => {
  const loadedform = {
    title: "survey2",
    elements: [
      {
        name: "What's your favorite color?",
        type: "radiogroup",
        choices: ["Blue", "Orange", "White", "Purple"],
        rateMin: 1,
        rateMax: 5,
        minRateDescription: "Bad",
        maxRateDescription: "Good",
        id: 0.8860674509516913,
        coef: 3,
      },
      {
        name: "New Question",
        type: "radiogroup",
        choices: ["Blue", "Orange", "White", "Purple"],
        rateMin: 1,
        rateMax: 5,
        minRateDescription: "Bad",
        maxRateDescription: "Good",
        id: 0.36592398322227804,
        coef: 2,
      },
    ],
    date: "2022-4-3",
  };
  const insertCoefToSurvey = (survey, answers) => {
    let newAnswers = [];
    let indexOfQuestion = 0;
    for (let item in answers) {
      newAnswers.push({
        question: item,
        answer: answers[item],
        coef: survey.elements[indexOfQuestion].coef,
      });
      indexOfQuestion++;
    }
    return newAnswers;
};

const onComplete = (survey, options) => {
    // TODO Write survey results into database TO CHANGE
    // TODO : send the data according this token, make this token unvalide, update subsession data (stats)
    const answersWithCoefs = insertCoefToSurvey(loadedform, survey.data);
    console.log(JSON.stringify(answersWithCoefs));
  };


  const model = new Survey.Model(loadedform);
  return (
    <Container maxWidth="false">
      <Container maxWidth="false">
        <Typography
          sx={{ mb: 2, mt: 2 }}
          variant="h3"
          component="div"
          color="#FFE600"
        >
          EY Survey
        </Typography>
        <Typography sx={{ mb: 7 }} variant="h6" component="div" color="white">
          {
            "Surveys are completly Anonymous, No personal data are collected. Please answer the survey alone. Dont share this link with no one."
          }
        </Typography>

        {loadedform && (
          <Survey.Survey
            model={model}
            json={loadedform}
            onComplete={onComplete}
          />
        )}
      </Container>
    </Container>
  );
};
export default TestMember;
