import React, { useState, useContext, useEffect } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

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

//Components
import GeneralForm from "./GeneralForm";
import Review from "./Review";

const UpdateSessionDialog = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const steps = ["General info", "Submit"];
  const [activeStep, setActiveStep] = useState(0);

  const [users, setUsers] = useState([]);

  const [generalData, setGeneralData] = useState({
    title: props.title,
    description: props.description,
    state: props.state,
    startDate: props.startDate,
    endDate: props.endDate,
  });
  const projectId = props.projectId;

  const getData = (dataa) => {
    console.log("dataaa :" + JSON.stringify(dataa));
    setGeneralData(dataa);
  };
  useEffect(() => {
    const fetchProjectById = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/project/${props.projectId}/session/${props.sessionId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setUsers(
          responseData.project.colleagues.map((item) => {
            return { name: item.name, email: item.email, image: item.image };
          })
        );
      } catch (err) {}
    };
    fetchProjectById();
  }, [sendRequest, projectId]);
  //Update Project
  const updateSession = async () => {
    try {
      // console.log("data to submit :" + JSON.stringify(generalData));

      const formData = new FormData();
      formData.append("title", generalData.title);
      formData.append("description", generalData.description);
      formData.append("state", generalData.state);

      formData.append("startDateString", generalData.startDate.stringDate);
      formData.append("startDate", generalData.startDate.date);
      formData.append("endDateString", generalData.endDate.stringDate);
      formData.append("endDate", generalData.endDate.date);

      await sendRequest(
        `http://localhost:5000/api/projects/project/${props.projectId}/session/${props.sessionId}`,
        "PATCH",
        JSON.stringify({
          title: generalData.title,
          description: generalData.description,
          state: generalData.state,
          startDateString: generalData.startDate.stringDate,
          startDate: generalData.startDate.date,
          endDateString: generalData.endDate.stringDate,
          endDate: generalData.endDate.date,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onRefresh();
    } catch (err) {}
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
          <Review
            onSubmit={updateSession}
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
    <Dialog open={props.open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item lg={11.25}>
            Update Session
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
export default UpdateSessionDialog;
