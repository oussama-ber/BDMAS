import React, { useState, useContext, useEffect } from "react";

import "survey-react/survey.css";
import * as Survey from "survey-react";

const PreviewSurvey = () => {
  const onComplete = (survey, options) => {
    // TODO Write survey results into database TO CHANGE
    console.log("Survey results: " + JSON.stringify(survey.data));
  };
  const model = new Survey.Model(json);
  return <Survey.Survey model={model} onComplete={onComplete} json={json} />;
};
export default PreviewSurvey;
