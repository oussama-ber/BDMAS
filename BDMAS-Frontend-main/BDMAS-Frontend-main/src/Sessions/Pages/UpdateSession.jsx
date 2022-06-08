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

const UpdateSession = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSession, setLoadedSession] = useState();
  const projectId = props.projectId;
  const sessionId = props.sessionId;

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
          `http://localhost:5000/api/projects/project/${projectId}/session/${sessionId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedSession(responseData.session);
        setFormData(
          {
            title: {
              value: responseData.session.title,
              isValid: true,
            },
            description: {
              value: responseData.session.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchProject();
  }, [sendRequest, projectId, setFormData, sessionId]);

  const SessionUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
        console.log(formState.inputs.title.value)
        console.log(formState.inputs.description.value)
      await sendRequest(
        `http://localhost:5000/api/projects/project/${projectId}/session/${sessionId}`,
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
    // history.push(`project/${projectId}/session/details/${sessionId}`)
    props.changeTab();
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

  if (!loadedSession && !error) {
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
  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        {!isLoading && loadedSession && (
          <Grid lg={5} xs={12} md={7}>
            <Paper elevation={10} style={paperStyle}>
              <Grid align="center" style={{ height: "flex" }}>
                <AddIcon htmlColor="#000000" fontSize="large" />

                <h2>Update SESSION</h2>
              </Grid>
              <form
              onSubmit={SessionUpdateSubmitHandler}
              >
                <InputField
                  id="title"
                  element="input"
                  type="text"
                  label="Title"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid title."
                  onInput={inputHandler}
                  initialValue={loadedSession.title}
                  initialValid={true}
                />
                <InputField
                  id="description"
                  element="textarea"
                  label="Description"
                  validators={[VALIDATOR_MINLENGTH(5)]}
                  errorText="Please enter a valid description (min. 5 characters)."
                  onInput={inputHandler}
                  initialValue={loadedSession.description}
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
                    UPDATE Session
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
export default UpdateSession;
