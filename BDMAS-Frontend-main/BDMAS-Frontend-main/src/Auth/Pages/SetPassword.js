import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import InputField from "../../shared/FormElements/InputField";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
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

const SetPassword = (props) => {
  const secretToken = useParams().secretToken;
  console.log(secretToken);
  console.log("secrettoken from setPassword " + window.location.href);
  const history = useHistory();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [open, setOpen] = useState(true);
  const [loadedData, setLoadedData] = useState();
  const [formState, inputHandler, setFormData] = useForm(
    {
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

 

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      //TO CHANGE THE URL
      const responseData = await sendRequest(
        `http://localhost:5000/api/users/reset/${secretToken}`,
        "POST",
        JSON.stringify({
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
          // "Authorization": 'Bearer ' + secretToken
        }
      );
      setLoadedData(responseData);
    } catch (err) {}
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleLoginPage = () => {
    setOpen(false);
    history.push(`/authenticate`);
  };
  const paperStyle = {
    padding: 20,
    height: "100vh",
    width: 600,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#fee600" };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Grid>
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
                {"Password changed successfully."}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Please check your account using your new credentials.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Okey</Button>
                <Button onClick={handleLoginPage}>LOGIN</Button>
              </DialogActions>
            </Dialog>
          )}
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockIcon />
            </Avatar>
            <h2>Reset Password</h2>
          </Grid>
          <Divider />
          <form onSubmit={authSubmitHandler}>
            <InputField
              element="input"
              id="password"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password."
              onInput={inputHandler}
            />
            <Box textAlign="center">
              <Button
                type="submit"
                disabled={!formState.isValid}
                align="center"
                variant="contained"
                color="primary"
                height="20"
              >
                Reset Password
              </Button>
            </Box>
          </form>
          <br />
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default SetPassword;
