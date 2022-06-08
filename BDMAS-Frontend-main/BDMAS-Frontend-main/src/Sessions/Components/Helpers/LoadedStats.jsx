import React, { useState } from "react";

// Components
import StatItem from "./StatItem";

export const LoadedStats = (props) => {
  const elements = props.sessionIds;

  const [answers, setAnswers] = useState();

  const { subSessionAnswersVar, getSubSessionsAnswers } = StatItem();
  
  let filtredAnswers;

  const addAnswer = (answer) => {
    setAnswers((prevData) => {
      return [...prevData, answer];
    });
  };
  
  if (elements) {
    filtredAnswers = elements.map((element, index) => {
      getSubSessionsAnswers(element);
    });
  }

  return { filtredAnswers };
};
