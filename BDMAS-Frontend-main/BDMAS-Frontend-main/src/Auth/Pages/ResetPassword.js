import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

// ui material
import LockIcon from "@mui/icons-material/Lock";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ErrorModal from "../../shared/UIElements/ErrorModal";
// Components
import WhiteModeButton from "../../shared/UIElements/WhiteModeButton";
import ImageUpload from "../../shared/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import InputField from "../../shared/FormElements/InputField";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";

const ResetPassword = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [open, setOpen] = useState(true);
  const [loadedData, setLoadedData] = useState();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/reset",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setLoadedData(responseData);
      //   auth.login(responseData.userId, responseData.token, responseData.role);
      //   console.log(responseData.role);
      //   history.push(`/user/dashboard`);
      // history.push(`/projects/new`);
    } catch (err) {}
  };
  const handleClose = () => {
    setOpen(false);
  };
  const paperStyle = {
    padding: 20,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#fee600" };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Grid container direction="row" justifyContent="center">
        <Grid item lg={6}>
          <Paper elevation={10} style={paperStyle}>
            {isLoading && <LoadingSpinner asOverlay />}
            {loadedData && (
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"request submitted successfully"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Please check your email to start updating your password.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Okey</Button>
                </DialogActions>
              </Dialog>
            )}
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <LockIcon />
              </Avatar>
              <h2>Reset Password</h2>
            </Grid>
            <Divider sx={{mb: 3}} />
            <form onSubmit={authSubmitHandler}>
              <InputField
                element="input"
                id="email"
                type="email"
                label="E-Mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
              />
              <Box textAlign="center">
                <WhiteModeButton
                  type="submit"
                  disabled={!formState.isValid}
                >
                  Send Request
                </WhiteModeButton>
              </Box>
            </form>
            <br />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ResetPassword;
