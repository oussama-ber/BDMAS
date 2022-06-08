import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import LoadingSpinner from '../../../shared/UIElements/LoadingSpinner';
import Question from "../models/Question";
import UpdateComponent from "../Components/UpdateComponent";

export default function UpdateForm() {
  const [loadedform, setLoadedForm] = useState();
  const [formTitle, setFormTitle] = useState();
  const [formElements, setFormElements] = useState();
  const auth = useContext(AuthContext);
  const formId = useParams().formId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //Geting data
  let initialTitle;
  useEffect(() => {
    const GetFormById = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/forms/form/${formId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        console.log(JSON.parse(responseData.form[0].form).title);
        console.log(JSON.parse(responseData.form[0].form).elements);
        // console.log( JSON.parse(responseData.form[0].form).title);
        setFormTitle(JSON.parse(responseData.form[0].form).title);
        const initialQuestions = await JSON.parse(
          responseData.form[0].form
        ).elements.map((item, index) => {
          return new Question({
            name: item.name,
            type: item.type,
            choices: item.choices,
            choicesWithVal : item.choicesWithVal,
            rateMin: item.rateMin,
            rateMax: item.rateMax,
            minRateDescription: item.minRateDescription,
            maxRateDescription: item.maxRateDescription,
          });
        });
        console.log(initialQuestions);
        setFormElements(initialQuestions);
        setLoadedForm(responseData.form[0].form);
      } catch (err) {}
    };
    GetFormById();
  }, [sendRequest, formId]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && formElements && (
        <UpdateComponent
          form={loadedform}
          formTitle={formTitle}
          formElements={formElements}
          formId={formId}
        />
      )}
    </React.Fragment>
  );
}
