import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

import { useInputValue } from "../Input-hooks";
import SurveyTitle from "../Components/SurveyTitle";
import Question from "../models/Question";
import ListController from "../Controllers/ListController";
import SurveyQuestion from "../Components/SurveyQuestion";

// MUI
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Snackbar from "@mui/material/Snackbar";
//dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
//icons
import AddIcon from "@mui/icons-material/Add";
// surveyjs TO CHANGE
import "survey-react/survey.css";
import * as Survey from "survey-react";

// Components
import WhiteModeButton from "../../../shared/UIElements/WhiteModeButton";

const UpdateComponent = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  console.log(props.formTitle)
  const [title, handleChangeTitle] = useInputValue(props.formTitle);
  const [description, handleChangeDescription] = useInputValue();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [openAddQuestionAlert, setOpenAddQuestionAlert] = useState(false);
  const [openDeleteQuestionAlert, setOpenDeleteQuestionAlert] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  //TO CHANGE
  
  const [questions, setQuestions] = useState(props.formElements);

  const listController = new ListController(questions, setQuestions);
  const json = JSON.stringify({ title, description, elements: questions });
  const model = new Survey.Model(json);

  const onComplete = (survey, options) => {
    // TODO Write survey results into database TO CHANGE
    console.log("Survey results: " + JSON.stringify(survey.data));
  };
  console.log(  props.form)
  console.log(props.formElements)
  console.log(questions)


  const [showManagement, setShowManagement] = useState(0);
  const tabManagement = () => {
    setShowManagement(() => {
      if (showManagement === 0) {
        return 1;
      } else return 0;
    });
  };
  const updateData = async () => {
    closeSubmitFormDialogHandler();
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/forms/form/${props.formId}`,
        "PATCH",
        JSON.stringify({
          formQuestion: { title, description, elements: questions, date: date },
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/forms`);
    } catch (err) {
      console.log(err);
    }
  };
  // OPEN/CLOSE  QUESTION ADDED
  const openQuestionAlerthandler = () => setOpenAddQuestionAlert(true);

  const closeQuestionAlerthandler = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAddQuestionAlert(false);
  };
  // OPEN/CLOSE QUESTION DELETED
  const openDeleteQuestionAlerthandler = () => setOpenDeleteQuestionAlert(true);

  const closeDeleteQuestionAlerthandler = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteQuestionAlert(false);
  };
  // Submit Dialog OPEN/CLOSE
  const openSubmitFormDialogHandler = () => setOpenSubmitDialog(true);

  const closeSubmitFormDialogHandler = () => setOpenSubmitDialog(false);

  return (
    <div style={{ background: "#1A1A24" }}>
      <Tabs
        value={showManagement}
        TabIndicatorProps={{ style: { background: "#FFE600" } }}
        textColor="inherit"
        variant="fullWidth"
        aria-label="Tab management"
        sx={{ marginBottom: 3 }}
      >
        <Tab
          label="Form Management"
          sx={{ color: "#FFE600" }}
          onClick={tabManagement}
        />
        <Tab
          label="Form Preview"
          sx={{ color: "#FFE600" }}
          onClick={tabManagement}
        />
      </Tabs>

      <div className="container my-10">
        {!!!showManagement && (
          <div>
            <SurveyTitle
              title={title}
              handleChangeTitle={handleChangeTitle}
              description={description}
              handleChangeDescription={handleChangeDescription}
            />
            {/* TESTING */}
            <ol style={{ margin: 0, padding: 0 }}>
              {questions.map((question, i) => (
                <SurveyQuestion
                  key={question.id}
                  question={question}
                  setQuestion={(question) => listController.set(i, question)}
                  removeQuestion={() => {
                    listController.remove(i);
                    openDeleteQuestionAlerthandler();
                  }}
                  moveQuestionUp={() => listController.moveUp(i)}
                  moveQuestionDown={() => listController.moveDown(i)}
                />
              ))}
            </ol>
            <Box textAlign="center">
              <Button
                sx={{
                  borderRadius: 0,
                  borderColor: "#3A3A4A ",
                  backgroundColor: "#FFE600",
                }}
                color="inherit"
                onClick={() => {
                  listController.add(new Question());
                  openQuestionAlerthandler();
                }}
                variant="outlined"
                endIcon={<AddIcon />}
              >
                Add Question
              </Button>
            </Box>
            <Snackbar
              open={openAddQuestionAlert}
              autoHideDuration={1000}
              onClose={closeQuestionAlerthandler}
            >
              <Alert
                onClose={closeQuestionAlerthandler}
                severity="success"
                sx={{ width: "100%" }}
              >
                Question Added !
              </Alert>
            </Snackbar>
            <Snackbar
              open={openDeleteQuestionAlert}
              autoHideDuration={1000}
              onClose={closeDeleteQuestionAlerthandler}
            >
              <Alert
                onClose={closeDeleteQuestionAlerthandler}
                severity="warning"
                sx={{ width: "100%" }}
              >
                Question Deleted !
              </Alert>
            </Snackbar>
          </div>
        )}
        {!!showManagement && (
          <div class="container ">
            <Survey.Survey model={model} onComplete={onComplete} />
            <Button
              sx={{
                borderRadius: 0,
                borderColor: "#3A3A4A ",
                backgroundColor: "#FFE600",
              }}
              color="inherit"
              variant="outlined"
              onClick={openSubmitFormDialogHandler}
            >
              UPDATE FORM
            </Button>
            <Dialog
              open={openSubmitDialog}
              onClose={closeSubmitFormDialogHandler}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Are you sure to submit your form"}  
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  did you make you want to update this form.
                </DialogContentText>
              </DialogContent>
              <DialogActions textAlign="center">
                <WhiteModeButton onClick={closeSubmitFormDialogHandler} >
                  Cancel
                </WhiteModeButton>
                <WhiteModeButton onClick={updateData} >
                  UPDATE
                </WhiteModeButton>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};
export default UpdateComponent;
