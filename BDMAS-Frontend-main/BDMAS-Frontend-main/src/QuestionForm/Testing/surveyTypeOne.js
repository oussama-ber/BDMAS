import React from 'react'; 
import "survey-react/survey.css";

import * as Survey from 'survey-react';
//TODO create a question of type json
import Json from './QuestionOne';

const Mysurvey = () => {
    return (
        <Survey.Survey  
        showCompletedPage={false}
        onComplete={data=> console.log(data.valuesHash)}
        json={Json} /> 
    )
}

export default Mysurvey; 