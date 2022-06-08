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
import GeneralForm from "./UpdateProjectComponents/GeneralForm";
import UpdateColleagues from "./UpdateProjectComponents/UpdateColleagues";
import Review from "./UpdateProjectComponents/Review";

const UpdateProjectDialog = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const steps = ["General info", "Contributors", "Submit"];
  const [activeStep, setActiveStep] = useState(0);

  const [users, setUsers] = useState([]);

  const [generalData, setGeneralData] = useState({
    title: props.title,
    description: props.description,
    address: props.address,
    state: props.state,
    image: props.image,
    startDate: props.startDate,
    endDate: props.endDate,
    editedImage: false,
  });
  const projectId = props.projectId;

  const getContributors = (dataa) => {
    console.log("users from updateDialog: " + JSON.stringify(dataa));
    setUsers(dataa);
  };
  const getData = (dataa) => {
    setGeneralData(dataa);
  };
  useEffect(() => {
    const fetchProjectById = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/${projectId}`,
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
  const updateProject = async () => {
    try {
      const formData = new FormData();
      formData.append("title", generalData.title);
      formData.append("description", generalData.description);
      formData.append("address", generalData.address);
      formData.append("state", generalData.state);

      formData.append("startDateString", generalData.startDate.stringDate);
      formData.append("startDate", generalData.startDate.date);
      formData.append("endDateString", generalData.endDate.stringDate);
      formData.append("endDate", generalData.endDate.date);
      if (generalData.editedImage) {
        formData.append("image", generalData.image);
      }
      formData.append("colleagues", JSON.stringify(users));
      await sendRequest(
        `http://localhost:5000/api/projects/${projectId}`,
        "PATCH",
        formData,
        {
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
          <React.Fragment>
            {users && !isLoading && (
              <UpdateColleagues
                getContributors={getContributors}
                onNext={handleNext}
                onBack={handleBack}
                items={users}
                users={props.users}
              />
            )}
          </React.Fragment>
        );

      case 2:
        return (
          <Review
            onSubmit={updateProject}
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
            Update Project
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
export default UpdateProjectDialog;
