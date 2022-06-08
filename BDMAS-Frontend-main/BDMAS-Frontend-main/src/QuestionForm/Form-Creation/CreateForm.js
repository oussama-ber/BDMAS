import React, { useState, useContext, useEffect } from "react";
import "survey-react/survey.css";
import * as Survey from "survey-react";
import AddQuestionCard from "./AddQuestionCard";
import { useHttpClient } from "../../shared/hooks/http-hook";
import FormManagement from "./FormManagement";
//mui
import { Button, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useForm } from "../../shared/hooks/form-hook";
import AddFormDetails from "./AddFormDetails";
import DeleteQuestion from "./DeleteQuestion";
import Grid from "@mui/material/Grid";
import "./CreateForm.css";
import SideBarFromMangement from "./SideBarFormMangement";

// create the question form locally, onComplete stored to the database

//the json (the question form object), elements: array of questions.
let json = {
  elements: [
    // {
    //   type: "text",
    //   name: "customerName",
    //   title: "What is your name?",
    //   isRequired: true,
    // },
  ],
};

const CreateForm = (props) => {
  // const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [elements, setElements] = useState(json.elements);
  const [form, setForm] = useState(json);
  const [submitFormDisabled, setSubmitFormDisabled] = useState(true);
  useEffect(() => {
    console.log(" the length of elements", json.elements.length);
    if (json.elements.length === 0) {
      setSubmitFormDisabled(true);
    } else {
      setSubmitFormDisabled(false);
    }
  }, [json.elements]);

  console.log("this is the form", form);
  const onComplete = (survey, options) => {
    // TODO Write survey results into database TO CHANGE
    console.log("Survey results: " + JSON.stringify(survey.data));
  };

  const getUpdatedForm = () => {
    return form;
  };

  useEffect(() => {
    getUpdatedForm();
  }, [form]);

  const addQuestionHandler = (question) => {
    console.log(JSON.stringify(question));
    //add unique tag for the question
    question.tag = Math.random(1000).toString();

    //push question to the array
    setElements((prevData) => {
      return (json.elements = [...prevData, question]);
    });
    console.log(JSON.stringify(json));
  };
  const addFromDetailsHandler = (formData) => {
    let formm;
    setForm(() => {
      formm = { ...json };
      formm.title = formData.title.value;
      formm.description = formData.description.value;
      formm.logo =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/EY_logo_2019.svg/1200px-EY_logo_2019.svg.png";
      formm.logoPosition = "right";
      return (json = formm);
    });
    console.log(JSON.stringify(json));
  };
  //DONE
  const DeleteQuestionHandler = (questionIndex) => {
    // console.log(questionIndex);
    const newIndex = questionIndex;
    console.log(newIndex);
    const thisQuestion = json.elements[newIndex];
    console.log("this is the question to delete", thisQuestion);
    const INDEXTEST = 1;
    let formm;
    setElements((pre) => {
      formm = { ...json };
      console.log(formm.elements);
      // TO CHANGE thisQuestion INDEXTEST
      formm.elements = formm.elements.filter((value) => {
        console.log(typeof formm.elements.indexOf(value));
        return value !== thisQuestion;
      });
      console.log(formm);
      return (json.elements = formm.elements);
      // return formm.elements.splice(questionIndex - 1, 1);
    });
    console.log(json.elements);
  };

  const updateHandler = () => {
    setForm(() => {
      json.elements[0].title = "qslkjg";
    });
  };
  const StoreData = async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/forms",
        "POST",
        JSON.stringify({ formQuestion: json }),
        { "Content-Type": "application/json" }
      );
    } catch (err) {}
  };

  const model = new Survey.Model(json);

  return (
    <div>
      {/* <FormManagement /> */}
      <Grid container spacing={1}>
        <Grid
          item
          sx={{ display: { xs: "none", md: "block", xl: "block" } }}
          md={2}
          lg={3}
        >
          <SideBarFromMangement
            onUpdate={updateHandler}
            onSubmitHandler={addFromDetailsHandler}
            form={form}
            onAddQuestion={addQuestionHandler}
            onDelete={DeleteQuestionHandler}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={10} lg={9}>
          <Typography
            variant="h3"
            gutterBottom
            component="div"
            align="center"
            xs={{ marginTop: 5 }}
          >
            Survey Preview
          </Typography>
          <Survey.Survey model={model} onComplete={onComplete} json={json} />
          <Paper elevation={10}>
            <Button
              variant="contained"
              onClick={StoreData}
              fullWidth
              sx={{ marginTop: 4 }}
              disabled={submitFormDisabled}
            >
              {" "}
              Submit Form
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default CreateForm;
