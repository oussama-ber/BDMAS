import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import { useInputValue } from "../../QuestionForm/Form-CreationV2/Input-hooks";
//mui components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/FormElements/ImageUpload";
import InputField from "../../shared/FormElements/InputField";

import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";

import { useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

//icons

import MoreTimeIcon from "@mui/icons-material/MoreTime";

import UndoIcon from "@mui/icons-material/Undo";
const paperStyle = {
  padding: 20,
  height: "100vh",
  width: 600,
  margin: "20px auto",
};

const NewSession = (props) => {
  const auth = useContext(AuthContext);
  const projectId = useParams().projectId;
  const [loadedForms, setLoadedForms] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [value, setValue] = useState(new Date());
  const history = useHistory();
  const [title, handleChangeTitle] = useInputValue();
  const [description, handleChangedescription] = useInputValue();
  const [form, setForm] = useState("");
  const [searchData, setSearchData] = useState("");

  console.log("assigned form ", form);

  const handleChange = (event) => setForm(event.target.value);
  // get Forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/forms`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedForms(responseData);
        console.log("the responseData", responseData.forms[0]);
        console.log(
          "the responseData",
          JSON.parse(responseData.forms[0].form).title
        );
      } catch (err) {}
    };
    fetchForms();
  }, [sendRequest]);

  const SessionSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      console.log(`token: ${auth.token} userId: ${auth.userId}`);
      console.log(JSON.stringify({ form: form + "" }));

      await sendRequest(
        "http://localhost:5000/api/projects/project/" + projectId,
        "POST",
        JSON.stringify({ title, description, form: form.toString() }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(`token: ${auth.token} userId: ${auth.userId}`);
      //TO CHANGE
      history.push(`/${auth.userId}/projects`);
    } catch (err) {}
  };
  const returnToProject = () =>
    history.push(`/projects/detailedview/${projectId}`);
  return (
    <Grid>
      <Button
        sx={{
          borderRadius: 0,
          borderColor: "#3A3A4A ",
          backgroundColor: "#FFE600",
        }}
        color="inherit"
        variant="outlined"
        startIcon={<UndoIcon />}
        onClick={returnToProject}
      >
        Project
      </Button>
      <ErrorModal error={error} onClear={clearError} />
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar>
            {" "}
            <MoreTimeIcon />
          </Avatar>
          <Typography>CREATE SESSION</Typography>
        </Grid>
        <form onSubmit={SessionSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Grid
            container
            direction="row"
            alignItems="baseline"
            justifyContent="center"
          >
            <Grid item lg={12}>
              <TextField
                variant="standard"
                type="text"
                required
                label="Session Title"
                value={title}
                onChange={handleChangeTitle}
              />
            </Grid>
            <Grid item lg={12} xs={12} md={12}>
              {" "}
              <TextField
                variant="standard"
                type="text"
                required
                label="Session description"
                value={description}
                onChange={handleChangedescription}
              />
            </Grid>

            {loadedForms && (
              <Grid item lg={12} xs={12} md={12} marginTop={3}>
                {loadedForms && <p>{loadedForms.forms[0]._id}</p>}
                <Autocomplete
                  freeSolo
                  autoHighlight
                  options={loadedForms.forms}
                  onChange={(event, value) => setForm(value._id)}
                  getOptionLabel={(option) => JSON.parse(option.form).title}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      
                      {JSON.parse(option.form).title} ({option._id})
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Form" />
                  )}
                />
                {/* <FormControl fullWidth>
                  <input
                    type="text"
                    value={searchData}
                    onChange={(event) => setSearchData(event.target.value)}
                    list="demo-simple-select"
                  />
                  <datalist
                    id="demo-simple-select"
                    value={form}
                    label="Age"
                    onChange={handleChange}
                  >
                    {loadedForms.forms
                      .filter((item) =>
                        JSON.parse(item.form)
                          .title.toLowerCase()
                          .includes(searchData)
                      )
                      .map((item, index) => {
                        return (
                          <option key={index} value={item._id}>
                            {JSON.parse(item.form).title}
                          </option>
                        );
                      })}
                  </datalist>
                </FormControl> */}
              </Grid>
            )}
            <Button
              type="submit"
              sx={{
                borderRadius: 0,
                borderColor: "#3A3A4A ",
                backgroundColor: "#FFE600",
              }}
              color="inherit"
              variant="outlined"
            >
              ADD Session
            </Button>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};
export default NewSession;
