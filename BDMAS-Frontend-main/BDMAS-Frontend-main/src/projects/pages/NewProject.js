import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/FormElements/ImageUpload";
import InputField from "../../shared/FormElements/InputField";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
//ui material
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
// ui materials icons
import AddIcon from '@mui/icons-material/Add';

// update file TODO, works: TODO IMPORTANT
const NewProject = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
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
  const history = useHistory();

  const projectSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      console.log(`token: ${auth.token} userId: ${auth.userId}`);
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        "http://localhost:5000/api/projects",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(`token: ${auth.token} userId: ${auth.userId}`)
      //TO CHANGE
      history.push(`/${auth.userId}/projects`);
    } catch (err) {}
  };
  const paperStyle = {
    padding: 20,
    height: "100vh",
    width: 600,
    
  };
  const avatarStyle = { backgroundColor: "#fee600" };
  return (
    <Grid align="center">
      <ErrorModal error={error} onClear={clearError} />
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddIcon htmlColor="#000000" fontSize="large"/>
          </Avatar>
            <h2>CREATE PROJECT</h2>
        </Grid>

        <form className="project-form" onSubmit={projectSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <InputField
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
          />
          <InputField
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
          />
          <InputField
            id="address"
            element="input"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid address."
            onInput={inputHandler}
          />
          <ImageUpload
            id="image"
            onInput={inputHandler}
            errorText="Please provide an image."
          />
          <Button
            type="submit"
            sx={{
              borderRadius: 0,
              borderColor: "#3A3A4A ",
              backgroundColor: "#FFE600",
            }}
            color="inherit"
            variant="outlined"
            disabled={!formState.isValid}
          >
            ADD PROJECT
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};
export default NewProject;
