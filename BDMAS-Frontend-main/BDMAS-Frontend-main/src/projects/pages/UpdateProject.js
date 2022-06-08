import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
// import './PlaceForm.css';
import InputField from "../../shared/FormElements/InputField";

//mui material
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";

const UpdateProject = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProject, setLoadedProject] = useState();
  const projectId = props.projectId;
  const history = useHistory();
  console.log(projectId);
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/${projectId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedProject(responseData.project);
        setFormData(
          {
            title: {
              value: responseData.project.title,
              isValid: true,
            },
            description: {
              value: responseData.project.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchProject();
  }, [sendRequest, projectId, setFormData]);

  const projectUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/projects/${projectId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/projects");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        {" "}
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedProject && !error) {
    return (
      <div className="center">
        <Paper>
          <h2>Could not find project!</h2>
        </Paper>
      </div>
    );
  }
  const paperStyle = {
    padding: 20,
    height: "100vh auto",
    width: "600px auto",
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#fee600" };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        {!isLoading && loadedProject && (
          <Grid lg={5} xs={12} md={7}>
            <Paper elevation={10} style={paperStyle}>
              <Grid align="center" style={{ height: "flex" }}>
                <Avatar
                  style={avatarStyle}
                  src={`http://localhost:5000/${loadedProject.image}`}
                  alt={loadedProject.title}
                >
                  <AddIcon htmlColor="#000000" fontSize="large" />
                </Avatar>
                <h2>Update PROJECT</h2>
              </Grid>
              <form
                onSubmit={projectUpdateSubmitHandler}
                
              >
                <InputField
                  id="title"
                  element="input"
                  type="text"
                  label="Title"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid title."
                  onInput={inputHandler}
                  initialValue={loadedProject.title}
                  initialValid={true}
                />
                <InputField
                  id="description"
                  element="textarea"
                  label="Description"
                  validators={[VALIDATOR_MINLENGTH(5)]}
                  errorText="Please enter a valid description (min. 5 characters)."
                  onInput={inputHandler}
                  initialValue={loadedProject.description}
                  initialValid={true}
                />
                <Box textAlign="center">
                  <Button
                    sx={{
                      borderRadius: 0,
                      borderColor: "#3A3A4A ",
                      backgroundColor: "#FFE600",
                    }}
                    color="inherit"
                    variant="outlined"
                    type="submit"
                    disabled={!formState.isValid}
                  >
                    UPDATE project
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default UpdateProject;
