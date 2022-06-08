import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "survey-react/survey.css";
import * as Survey from "survey-react";
// MUI
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// mui icons
import UndoIcon from "@mui/icons-material/Undo";
// Components
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";

const BankMember = () => {
  const [loadedform, setLoadedForm] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const projectId = useParams().pid;
  const sessionId = useParams().sid;
  const subsessionId = useParams().ssid;
  const formId = useParams().fid;
  const token = useParams().token;
  console.log(formId);

  useEffect(() => {
    const GetFormById = async () => {
      try {
        console.log("this is formId : " + formId);
        const responseData = await sendRequest(
          `http://localhost:5000/api/forms/form/client/${formId}`,
          "GET",
          null,
          {}
        );
        // console.log(JSON.stringify(responseData));
        // console.log(responseData.form[0].form);
        // console.log(JSON.stringify(responseData));
        setLoadedForm(responseData.form[0].form);
      } catch (err) {}
    };
    GetFormById();
  }, [sendRequest, formId]);

  const answerForm = async (answer) => {
    // console.log("answer" + answer);
    console.log(" answer json" + JSON.stringify(answer));
    try {
      await sendRequest(
        `http://localhost:5000/api/forms/project/${projectId}/session/${sessionId}/subSession/${subsessionId}/form/${formId}/token/${token}`,
        "POST",
        JSON.stringify({ answer: { answer } }),
        { "Content-Type": "application/json" }
      );
    } catch (err) {}
  };

  const backToFormList = () => history.push("/forms");

  const onComplete = (survey, options) => {
    // TODO Write survey results into database TO CHANGE
    // console.log("Survey results: " + JSON.stringify(survey.data));
    // console.log("Survey results JSON: " + survey.data);
    const answersWithCoefs = insertCoefToSurvey(loadedform, survey.data);
    console.log(JSON.stringify(answersWithCoefs));
    // send answer to backend.
    answerForm(answersWithCoefs);

    // TODO : send the data according this token, make this token unvalide, update subsession data (stats)
  };

  // Helpers
  const insertCoefToSurvey = (survey, answers) => {
    let newAnswers = [];
    let indexOfQuestion = 0;
    console.log(`survey ${survey}`);
    console.log(`answers ${JSON.stringify(answers)}`);

    let indexx = 0;
    for (let item in answers) {
      // get the whole the right element from elements
      const thequestion = JSON.parse(survey).elements.find(
        (question) => question.name === item
      );
      console.log(thequestion);
      if (thequestion.type === "checkbox") {
        //   console.log(`the question of checkbox ${JSON.stringify(thequestion)}`);
        //   console.log(`the proper way to display answer checkbox:
        //   the question: ${item},
        //   type: ${thequestion.type},
        //   the answers: ${answers[item]},
        //   answers: ${answers["option11"]}
        //  `);
        const optionWithVals = thequestion.choicesWithVal.filter((itemm) => {
          if (answers[item].some((el) => itemm.option === el)) {
            return itemm;
          }
        });
        console.log("options with vals " + JSON.stringify(optionWithVals));
        newAnswers.push({
          question: item,
          type: thequestion.type,
          answer: answers[item],
          answersWithVal: optionWithVals,
          coef: thequestion.coef,
        });
        // TODO
      } else if (thequestion.type === "rating") {
        // DONE
        console.log(`the proper way to display answer rating
        the question: ${item},
        type: ${thequestion.type}
        then answer: ${answers[item]},
        then value: ${answers[item]},
        coef: ${thequestion.coef}
        `);
        newAnswers.push({
          question: item,
          type: thequestion.type,
          answer: answers[item],
          value: answers[item],
          coef: thequestion.coef,
        });
        // TODO
      } else if (thequestion.type === "radiogroup") {
        // DONE
        const answer = thequestion.choicesWithVal.find(
          (option) => option.option === answers[item]
        );

        console.log(`the proper way to display answser:
          the question: ${item},
          type: ${thequestion.type},
          the answer: ${answer.option}
          the value: ${answer.value}
          the coef: ${thequestion.coef}
          `);
        newAnswers.push({
          question: item,
          type: thequestion.type,
          answer: answer.option,
          value: answer.value,
          coef: thequestion.coef,
        });
      } else if (thequestion.type === "Comment") {
        // TODO
      }

      indexx++;
    }
    return newAnswers;
  };

  // console.log(JSON.stringify(loadedform));
  const model = new Survey.Model(loadedform);
  return (
    <Container maxWidth="false">
      <Container maxWidth="false">
        {isLoading && <LoadingSpinner />}
        <ErrorModal error={error} onClear={clearError} />
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

        {!loadedform && <h1> no form found</h1>}
        {loadedform && (
          <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Survey.Survey
              model={model}
              json={loadedform}
              onComplete={onComplete}
            />
          </React.Fragment>
        )}
      </Container>
    </Container>
  );
};
export default BankMember;
