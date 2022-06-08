import React, { useState, useContext, useEffect } from "react";
import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { AuthContext } from "../../../../shared/context/auth-context";

//MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

//ICONS
import ClearIcon from "@mui/icons-material/Clear";
// Components:
import GeneralForm from "./GeneralForm";
import UpdateForm from "./UpdateForm";
import UpdateMembers from "./UpdateMembers";
import Review from "./Review";

const UpdateSubSessionDialog = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const steps = ["General info", "Form", "Members", "Submit"];
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [csvArray, setCsvArray] = useState(
    props.bankMembers.length == 0 ? [] : props.bankMembers
  );
  const [generalData, setGeneralData] = useState({
    title: props.title,
    description: props.description,
    address: props.address,
    state: props.state,
    startDate: props.startDate,
    endDate: props.endDate,
  });
  const getData = (dataa) => {
    setGeneralData(dataa);
  };
  //submit update
  const updateSubSession = async () => {
    // console.log("the form to send to back end from update subSession");
    // TO CHANGE add csvArray.
    try {
    //   console.log("before send the array" + csvArray);
      await sendRequest(
        `http://localhost:5000/api/projects/session/${props.sessionId}/subsession/update/${props.subSesionID}`,
        "PATCH",
        JSON.stringify({
          title: generalData.title,
          description: generalData.description,
          state: generalData.state,

          csvArray,

          form,

          startDate: {
            stringDate: generalData.startDate.stringDate,
            date: generalData.startDate.date,
          },

          endDate: {
            stringDate: generalData.endDate.stringDate,
            date: generalData.endDate.date,
          },
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onRefresh();
    } catch (err) {}
    props.onRefresh();
  };

  //Step management
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <GeneralForm
            data={generalData}
            updateData={getData}
            handleNext={handleNext}
            onCancel={props.onClose}
          />
        );
      case 1:
        return (
          <UpdateForm
            setForm={setForm}
            form={form}
            setFormTitle={setFormTitle}
            formTitle={formTitle}
            handleNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <UpdateMembers
            setCsvArray={setCsvArray}
            csvArray={csvArray}
            handleNext={handleNext}
            onBack={handleBack}
            onclose={onClose}
          />
        );
      case 3:
        return (
          <Review
            onSubmit={updateSubSession}
            onBack={handleBack}
            onclose={onClose}
          />
        );

      default:
        throw new Error("Unknown step");
    }
  }
  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  const onClose = () => {
    setActiveStep(0);
    props.onClose();
  };
  return (
    <Dialog open={props.open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item lg={11.25}>
            Update Subsession
          </Grid>
          <Grid item lg>
            <IconButton onClick={onClose} color="error">
              <ClearIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      {/* STEPPER */}
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* MAIN CONTENT */}
      <React.Fragment>
        {!isLoading && getStepContent(activeStep)}
      </React.Fragment>
    </Dialog>
  );
};
export default UpdateSubSessionDialog;
