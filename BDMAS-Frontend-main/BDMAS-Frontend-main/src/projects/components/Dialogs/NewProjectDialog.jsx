import React, { useContext, useState } from "react";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import InputField from "../../../shared/FormElements/InputField";
import { AuthContext } from "../../../shared/context/auth-context";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
//helpers
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";
//MUI
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
//(stepper)
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

//icons
import ClearIcon from "@mui/icons-material/Clear";

// components
import GeneralForm from "./CreateProjectComponent/GeneralForm";
import AddColleagues from "./CreateProjectComponent/AddColleagues";
import Review from "./CreateProjectComponent/Review";
import WhiteModeButton from "../../../shared/UIElements/WhiteModeButton";
import UploadImageButton from "../../../shared/UIElements/UploadImageButton";

const NewProjectDialog = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const steps = ["General info", "Contributors", "Submit"];
  const [activeStep, setActiveStep] = useState(0);

  const [data, setData] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [colleagueTable, setColleagueTable] = useState([]);
  if (data) {
    console.log("contributors type : " + data.startDate.stringDate);
    console.log("contributors type : " + data.startDate.date);
    // console.log(contributors.map());
    // contributors.map((item) => {
    //   console.log(item.name, item.email, item.image);
    // });
  }
  //getData
  const getData = (dataa) => {
    setData(dataa);
    console.log("data from new project dialog: " + JSON.stringify(dataa));
  };
  //get Contributors
  const getContributors = (dataa) => {
    console.log(typeof dataa);
    setContributors(dataa);
    console.log("contributors : " + dataa);
  };

  //  Submit Data
  const projectSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("address", data.address);
      formData.append("image", data.image);
      formData.append("startDateString", data.startDate.stringDate);
      formData.append("startDate", data.startDate.date);
      formData.append("endDateString", data.endDate.stringDate);
      formData.append("endDate", data.endDate.date);
      formData.append("colleagues", JSON.stringify(contributors));
      console.log("formData : " + formData);
      await sendRequest(
        "http://localhost:5000/api/projects",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.openAlert();
      props.refresh((prevData) => !prevData);
    } catch (err) {}
  };

  //get content components
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <GeneralForm
            getData={getData}
            data={data}
            handleNext={handleNext}
            onCancel={props.onClose}
          />
        );
      case 1:
        return (
          <AddColleagues
            onNext={handleNext}
            onBack={handleBack}
            getContributors={getContributors}
            users={contributors}
          />
        );
      case 2:
        return <Review onSubmit={projectSubmitHandler} onBack={handleBack} />;
      default:
        throw new Error("Unknown step");
    }
  }
  //seteps management
  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item lg={11.25}>
            Create Project
          </Grid>
          <Grid item lg>
            <IconButton onClick={props.onClose} color="error">
              <ClearIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      {/* <DialogContent>
        <DialogContentText> Project step 1</DialogContentText>
        {isLoading && <LoadingSpinner asOverlay />}
      </DialogContent> */}
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
export default NewProjectDialog;

