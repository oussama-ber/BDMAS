import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

//mui
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
//ICONS
import ClearIcon from "@mui/icons-material/Clear";

//components
import GeneralForm from "../SubSessionDialog/GeneralForm";
import AddForms from "../SubSessionDialog/AddForms";
import AddBankMembers from "../SubSessionDialog/AddBankMembers";

const CreateSubSessionDialog = (props) => {
  // TODO project id props
  const auth = useContext(AuthContext);
  const sessionId = props.sessionId;
  const projectId = props.projectId;
  console.log(projectId)
  
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [activeStep, setActiveStep] = useState(0);
  const [csvArray, setCsvArray] = useState([]);
  const [form, setForm] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [data, setData] = useState(null);
  const getData = (dataa) => {
    setData(dataa);
    console.log("data from new project dialog: " + JSON.stringify(dataa));
  };

  const subSessionSubmitHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/projects/project/${projectId}/session/${sessionId}/subsession`,
        "POST",
        JSON.stringify({
          title: data.title,
          form,
          csvArray,
          description: data.description,
          startDate: {
            stringDate: data.startDate.stringDate,
            date: data.startDate.date,
          },
          endDate: {
            stringDate: data.endDate.stringDate,
            date: data.endDate.date,
          },
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onCloseDialog();
      props.onRefresh((prevData) => !prevData);
    } catch (err) {}
  };

  //   Stepper management
  const steps = ["General info", "Forms", "Bank Members List"];
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <GeneralForm
            data={data}
            getData={getData}
            handleNext={handleNext}
            onCancel={props.onClose}
          />
        );
      case 1:
        return (
          <AddForms
            handleBack={handleBack}
            handleNext={handleNext}
            setForm={setForm}
            form={form}
            setFormTitle={setFormTitle}
            formTitle={formTitle}
          />
        );
      case 2:
        return (
          <AddBankMembers
            handleBack={handleBack}
            handleNext={handleNext}
            setCsvArray={setCsvArray}
            csvArray={csvArray}
            finalSubmit={subSessionSubmitHandler}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <Dialog
      sx={{ color: "#2E2E3C", height: "700px" }}
      bodyStyle={{ backgroundColor: "red" }}
      open={props.open}
      onClose={props.onCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item lg={11.25}>
            Create SubSession
          </Grid>
          <Grid item lg>
            <IconButton onClick={props.onCloseDialog} color="error">
              <ClearIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <React.Fragment>{getStepContent(activeStep)}</React.Fragment>
    </Dialog>
  );
};
export default CreateSubSessionDialog;
