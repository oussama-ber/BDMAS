import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

// ui material
import LockIcon from "@mui/icons-material/Lock";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import ErrorModal from "../../shared/UIElements/ErrorModal";
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from "../../shared/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import InputField from "../../shared/FormElements/InputField";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";

// import './Auth.css';
import "../../App.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };
  const history = useHistory();
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        // console.log(
        //   "this is user Image: ccccccccccccccccccccccccccc: " +
        //     responseData.image
        //     + " user"+ JSON.stringify(responseData)
        // );
        auth.login(responseData.userId, responseData.token, responseData.role, responseData.image);
        // console.log(responseData.role);
        history.push(`/user/dashboard`);
        // history.push(`/projects/new`);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );
        console.log(
          "this is user Image: ccccccccccccccccccccccccccc: " +
            responseData.image
        );
        auth.login(
          responseData.userId,
          responseData.token,
          responseData.role,
          responseData.image
        );
        console.log(responseData.role);
        history.push(`/user/dashboard`);
      } catch (err) {}
    }
  };
  const resetPasswordPageHandler = () => {
    history.push("/user/reset-password");
  };
  const paperStyle = {
    padding: 20,
    height: "100vh auto",
    width: "600px auto",
    margin: "20px auto",
    // TO CHANGEbackgroundColor:'red'
  };
  const avatarStyle = { backgroundColor: "#1A1A24", color: "#fee600" };
  return (
    <Box justifyContent="center" color="red">
      <ErrorModal error={error} onClear={clearError} />
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Grid lg={5} xs={12} md={7}>
          <Paper elevation={10} style={paperStyle}>
            {isLoading && <LoadingSpinner asOverlay />}
            <Grid align="center" style={{ height: "flex" }}>
              <Typography
                sx={{ mt: 4, mb: 2 }}
                variant="h4"
                gutterBottom
                color="#1A1A24"
                component="div"
              >
                {isLoginMode ? "Login" : "SIGNUP"}
              </Typography>
              <Avatar style={avatarStyle}>
                <LockIcon />
              </Avatar>
            </Grid>
            <hr />
            <form onSubmit={authSubmitHandler}>
              {!isLoginMode && (
                <InputField
                  element="input"
                  id="name"
                  type="text"
                  label="Your Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a name."
                  onInput={inputHandler}
                  style={{ backgroundColor: "black" }}
                />
              )}
              {!isLoginMode && (
                <ImageUpload
                  center
                  id="image"
                  onInput={inputHandler}
                  errorText="Please provide an image."
                />
              )}
              <InputField
                element="input"
                id="email"
                type="email"
                label="E-Mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
              />
              <InputField
                element="input"
                id="password"
                type="password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters."
                onInput={inputHandler}
              />
              <Box textAlign="center">
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  align="center"
                  color="inherit"
                  sx={{
                    borderRadius: 0,
                    borderColor: "#3A3A4A ",
                    backgroundColor: "#FFE600",
                  }}
                  variant="outlined"
                >
                  {isLoginMode ? "LOGIN" : "SIGNUP"}
                </Button>
              </Box>
            </form>
            <br />
            <Box textAlign="center">
              {/* <Button onClick={switchModeHandler} variant="outlined">
                SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
              </Button> */}
              <Typography>
                did you forgot your password ?{" "}
                <Link onClick={resetPasswordPageHandler}> Reset Password</Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Auth;
